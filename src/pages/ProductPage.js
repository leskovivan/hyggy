import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ProductPage.css';

import Breadcrumb from '../components/Breadcrumb';
import ItemCard from '../components/ItemCard';
import ProductGallery from '../components/ProductGallery';
import ProductMainInfo from '../components/ProductMainInfo';
import ProductReviews from '../components/ProductReviews';
import ProductSpecs from '../components/ProductSpecs';
import RelatedBlogs from '../components/RelatedBlogs';
import ReviewModal from '../components/ReviewModal';
import { useAuth } from '../context/AuthContext';
import { products as localProducts } from './products';

const PRODUCTS_URL = 'http://localhost:3001/products';
const BLOGS_URL = 'http://localhost:3001/blogs';

const productKeywords = ['стілець', 'стіл', 'диван', 'ліжко', 'лампа', 'шафа', 'кухня', 'вітальня'];

const defaultCharacteristics = [
  { label: 'Матеріал', value: 'ППУ, фанера, поліестер, сталь' },
  { label: 'Колір', value: 'Оливковий, дуб' },
  { label: 'Вага', value: '4 кг' },
  { label: 'Розмір у зібраному стані', value: '46 см х 52 см х 83 см' },
  { label: 'Висота сидіння', value: '48 см' },
  { label: 'Навантаження', value: 'До 110 кг' },
  { label: 'Догляд', value: 'Очищати сухою або злегка вологою тканиною' },
];

const fallbackProduct = {
  id: 1,
  category: 'kitchen',
  brand: 'BISTRUP',
  name: 'Стілець обідній BISTRUP оливковий/дуб',
  price: 100,
  oldPrice: 150,
  inStock: true,
  hasDelivery: true,
  promoEndDate: '2026-04-30T23:59:59',
  article: '3605035',
  image: '/images/product-chair.png',
  images: ['/images/product-chair.png', '/images/product-chair.png', '/images/product-chair.png'],
  description:
    'Стілець BISTRUP поєднує лаконічний дизайн, зручну посадку та натуральний вигляд дубових ніжок. М’яке сидіння підтримує комфорт під час обідів, роботи або довгих розмов за столом, а спокійний оливковий колір легко поєднується з теплими дерев’яними фактурами.',
  shortDescription:
    'Стілець BISTRUP поєднує сучасний дизайн, зручну посадку та натуральний вигляд дубових ніжок.',
  characteristics: defaultCharacteristics,
  reviews: [
    {
      id: 1,
      author: 'Олена',
      rating: 3,
      text: 'Стілець гарно виглядає в інтер’єрі, сидіти зручно. Колір збігається з фото.',
    },
    {
      id: 2,
      author: 'Андрій',
      rating: 5,
      text: 'Купили кілька стільців для кухні. Збірка проста, конструкція тримається добре.',
    },
  ],
};

const hasMojibake = (value = '') => /(РЎ|Рђ|Рџ|Рњ|Рљ|Рќ|Р’|Р“|Р”|Рћ|Р†|СЊ|С–|С—|вЂ|Г–|Г…|Гі)/.test(String(value));
const textOrFallback = (value, fallback) => (value && !hasMojibake(value) ? value : fallback);

const normalizeSpecs = (specs) => {
  if (!Array.isArray(specs) || specs.length === 0) return defaultCharacteristics;

  const readable = specs.filter((item) => item?.label && item?.value && !hasMojibake(item.label) && !hasMojibake(item.value));
  return readable.length ? readable : defaultCharacteristics;
};

const normalizeReviews = (reviews) => {
  if (!Array.isArray(reviews)) return fallbackProduct.reviews;

  return reviews.map((review, index) => ({
    ...review,
    id: review.id || index + 1,
    author: textOrFallback(review.author || review.name, index === 0 ? 'Олена' : 'Андрій'),
    name: textOrFallback(review.name || review.author, index === 0 ? 'Олена' : 'Андрій'),
    text: textOrFallback(
      review.text || review.comment,
      index === 0
        ? 'Стілець гарно виглядає в інтер’єрі, сидіти зручно. Колір збігається з фото.'
        : 'Купили кілька стільців для кухні. Збірка проста, конструкція тримається добре.'
    ),
    rating: Number(review.rating || 5),
  }));
};

const normalizeProduct = (product = fallbackProduct) => {
  const base = String(product.id) === '1' ? { ...product, ...fallbackProduct } : product;
  const fallbackName = base.slug ? base.slug.replace(/-/g, ' ') : fallbackProduct.name;
  const image = base.image || base.images?.[0] || fallbackProduct.image;
  const images = Array.isArray(base.images) && base.images.length ? base.images : [image, image, image];

  return {
    ...base,
    brand: textOrFallback(base.brand, fallbackProduct.brand),
    name: textOrFallback(base.name, fallbackName),
    category: base.category || fallbackProduct.category,
    price: Number(base.price || fallbackProduct.price),
    oldPrice: base.oldPrice || null,
    hasDelivery: base.hasDelivery !== false,
    inStock: base.inStock !== false,
    article: textOrFallback(base.article, fallbackProduct.article),
    image,
    images,
    description: textOrFallback(base.description || base.shortDescription, fallbackProduct.description),
    shortDescription: textOrFallback(base.shortDescription || base.description, fallbackProduct.shortDescription),
    characteristics: normalizeSpecs(base.characteristics),
    reviews: normalizeReviews(base.reviews),
  };
};

const safeJson = async (response) => {
  if (!response.ok) throw new Error('Bad response');
  return response.json();
};

const ProductPage = () => {
  const { categoryName, productId } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const carouselRef = useRef(null);
  const recentCarouselRef = useRef(null);

  const localProduct = useMemo(
    () => localProducts.find((item) => String(item.id) === String(productId)),
    [productId]
  );

  useEffect(() => {
    if (!productId) return;

    const rawData = localStorage.getItem('viewedProducts');
    const parsedHistory = rawData ? JSON.parse(rawData) : [];
    const currentId = String(productId);
    const nextHistory = [currentId, ...parsedHistory.map(String).filter((id) => id !== currentId)].slice(0, 5);

    localStorage.setItem('viewedProducts', JSON.stringify(nextHistory));

    const idsToShow = nextHistory.filter((id) => id !== currentId);
    const localRecent = idsToShow
      .map((id) => localProducts.find((item) => String(item.id) === id))
      .filter(Boolean)
      .map(normalizeProduct);

    setRecentItems(localRecent);
  }, [productId]);

  useEffect(() => {
    let ignore = false;

    const loadProduct = async () => {
      setLoading(true);

      try {
        const fetchedProduct = await fetch(`${PRODUCTS_URL}/${productId}`).then(safeJson);
        const normalizedProduct = normalizeProduct(fetchedProduct);

        if (ignore) return;
        setProduct(normalizedProduct);

        const [allSimilars, allBlogs] = await Promise.all([
          fetch(`${PRODUCTS_URL}?category=${encodeURIComponent(normalizedProduct.category)}`).then(safeJson).catch(() => []),
          fetch(BLOGS_URL).then(safeJson).catch(() => []),
        ]);

        if (ignore) return;

        const safeProducts = Array.isArray(allSimilars) ? allSimilars.map(normalizeProduct) : [];
        const safeBlogs = Array.isArray(allBlogs) ? allBlogs : [];
        const productName = String(normalizedProduct.name || '').toLowerCase();

        setSimilarProducts(
          safeProducts
            .filter((item) => String(item.id) !== String(productId))
            .slice(0, 6)
        );

        const filteredBlogs = safeBlogs.filter((blog) => {
          const title = String(blog.title || '').toLowerCase();
          return productKeywords.some((word) => productName.includes(word) && title.includes(word));
        });

        setRelatedBlogs((filteredBlogs.length ? filteredBlogs : safeBlogs).slice(0, 3));
      } catch (error) {
        const fallback = normalizeProduct(localProduct || fallbackProduct);
        const fallbackSimilar = localProducts
          .filter((item) => String(item.id) !== String(productId) && item.category === fallback.category)
          .slice(0, 6)
          .map(normalizeProduct);

        if (!ignore) {
          setProduct(fallback);
          setSimilarProducts(fallbackSimilar);
          setRelatedBlogs([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo(0, 0);

    return () => {
      ignore = true;
    };
  }, [localProduct, productId]);

  const handleReviewSubmit = async (formDataFromModal) => {
    const newReview = {
      id: Date.now(),
      userId: user?.id,
      author: formDataFromModal.name || user?.name,
      name: formDataFromModal.name || user?.name,
      email: formDataFromModal.email || user?.email,
      subject: formDataFromModal.subject,
      text: formDataFromModal.comment,
      comment: formDataFromModal.comment,
      rating: formDataFromModal.rating,
      date: new Date().toLocaleDateString('uk-UA'),
    };

    const updatedReviews = [...(product.reviews || []), newReview];
    const totalRating = updatedReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    const newAverageRating = Math.round(totalRating / updatedReviews.length);

    setProduct({ ...product, reviews: updatedReviews, rating: newAverageRating });
    setIsModalOpen(false);

    try {
      await fetch(`${PRODUCTS_URL}/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: updatedReviews,
          rating: newAverageRating,
        }),
      });
    } catch (error) {
      console.error('Не вдалося зберегти відгук на сервері:', error);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollCarousel = (ref, direction) => {
    ref.current?.scrollBy({
      left: direction === 'left' ? -420 : 420,
      behavior: 'smooth',
    });
  };

  if (loading) {
    return (
      <div className="product-page-container">
        <main className="product-page-main product-loading">Завантаження товару...</main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-page-container">
        <main className="product-page-main product-not-found">
          <h1>404</h1>
          <h2>Товар не знайдено</h2>
          <p>Вибачте, але товару за цим посиланням не існує.</p>
          <Link to="/category" className="teal-btn">Повернутися до каталогу</Link>
        </main>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [product.image].filter(Boolean);

  return (
    <div className="product-page-container">
      <main className="product-page-main">
        <Breadcrumb customLabels={{ category: 'Категорії', [categoryName]: 'Результат пошуку', [productId]: product.name }} />

        <section className="product-hero">
          <ProductGallery images={productImages} productName={product.name} />
          <ProductMainInfo product={product} />
        </section>
      </main>

      <nav className="product-tabs-bar" aria-label="Розділи товару">
        <div className="product-page-main product-tabs">
          <button type="button" onClick={() => scrollToSection('desc')}>Опис</button>
          <button type="button" onClick={() => scrollToSection('specs')}>Характеристики</button>
          <button type="button" onClick={() => scrollToSection('reviews')}>Відгуки</button>
          <button type="button" onClick={() => scrollToSection('similar')}>Схожі товари</button>
        </div>
      </nav>

      <main className="product-page-main">
        <section id="desc" className="product-description-section">
          <h2 className="product-section-title">Опис</h2>

          <div className="product-description-grid">
            <div className="product-description-copy">
              <p>{product.description || product.shortDescription}</p>
              {product.article && <p className="product-article"><strong>Артикул: {product.article}</strong></p>}
              <RelatedBlogs blogs={relatedBlogs} />
            </div>

            <div className="product-description-media">
              <img src={productImages[0] || product.image} alt={product.name} />
            </div>
          </div>
        </section>

        <section id="specs" className="product-section">
          <ProductSpecs specs={product.characteristics} />
        </section>

        <section id="reviews" className="product-section">
          <ProductReviews
            reviews={product.reviews}
            onOpenModal={() => {
              if (!user) {
                alert('Тільки зареєстровані користувачі можуть залишати відгуки!');
                return;
              }
              setIsModalOpen(true);
            }}
          />
        </section>

        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleReviewSubmit}
          currentUser={user}
        />

        <section id="similar" className="product-carousel-section">
          <h2 className="product-section-title">Схожі товари</h2>
          <div className="product-carousel-shell">
            <button className="product-carousel-btn product-carousel-btn-prev" onClick={() => scrollCarousel(carouselRef, 'left')} aria-label="Попередні товари">&#8249;</button>
            <div className="product-carousel" ref={carouselRef}>
              {similarProducts.map((item) => (
                <div className="product-carousel-item" key={item.id}>
                  <ItemCard product={item} />
                </div>
              ))}
            </div>
            <button className="product-carousel-btn product-carousel-btn-next" onClick={() => scrollCarousel(carouselRef, 'right')} aria-label="Наступні товари">&#8250;</button>
          </div>
        </section>

        {recentItems.length > 0 && (
          <section className="product-carousel-section">
            <h2 className="product-section-title">Ви нещодавно переглядали</h2>
            <div className="product-carousel-shell">
              <button className="product-carousel-btn product-carousel-btn-prev" onClick={() => scrollCarousel(recentCarouselRef, 'left')} aria-label="Попередні переглянуті товари">&#8249;</button>
              <div className="product-carousel" ref={recentCarouselRef}>
                {recentItems.map((item) => (
                  <div className="product-carousel-item" key={item.id}>
                    <ItemCard product={item} />
                  </div>
                ))}
              </div>
              <button className="product-carousel-btn product-carousel-btn-next" onClick={() => scrollCarousel(recentCarouselRef, 'right')} aria-label="Наступні переглянуті товари">&#8250;</button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductPage;
