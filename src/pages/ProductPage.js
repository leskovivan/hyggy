import React, { useEffect, useRef, useState } from 'react';
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

const PRODUCTS_URL = 'http://localhost:3001/products';
const BLOGS_URL = 'http://localhost:3001/blogs';

const productKeywords = ['стілець', 'стіл', 'диван', 'ліжко', 'шафа', 'кухня', 'вітальня'];

const ProductPage = () => {
  const { productId } = useParams();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentItems, setRecentItems] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);

  const carouselRef = useRef(null);
  const recentCarouselRef = useRef(null);

  useEffect(() => {
    if (!productId) return;

    const rawData = localStorage.getItem('viewedProducts');
    const parsedHistory = rawData ? JSON.parse(rawData) : [];
    const currentId = String(productId);
    const nextHistory = [currentId, ...parsedHistory.map(String).filter(id => id !== currentId)].slice(0, 5);

    localStorage.setItem('viewedProducts', JSON.stringify(nextHistory));

    const idsToShow = nextHistory.filter(id => id !== currentId);

    if (!idsToShow.length) {
      setRecentItems([]);
      return;
    }

    const query = idsToShow.map(id => `id=${encodeURIComponent(id)}`).join('&');
    fetch(`${PRODUCTS_URL}?${query}`)
      .then(res => res.json())
      .then(data => setRecentItems(Array.isArray(data) ? data : []))
      .catch(error => console.error('Помилка історії переглядів:', error));
  }, [productId]);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`${PRODUCTS_URL}/${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Not Found');
        return res.json();
      })
      .then(currentProduct => {
        if (!currentProduct || Object.keys(currentProduct).length === 0) {
          throw new Error('Empty Product');
        }

        setProduct(currentProduct);

        Promise.all([
          fetch(`${PRODUCTS_URL}?category=${encodeURIComponent(currentProduct.category)}`).then(res => res.json()),
          fetch(BLOGS_URL).then(res => res.json()),
        ]).then(([allSimilars, allBlogs]) => {
          const safeProducts = Array.isArray(allSimilars) ? allSimilars : [];
          const safeBlogs = Array.isArray(allBlogs) ? allBlogs : [];
          const productName = String(currentProduct.name || '').toLowerCase();

          setSimilarProducts(
            safeProducts
              .filter(item => String(item.id) !== String(productId))
              .slice(0, 6)
          );

          const filteredBlogs = safeBlogs.filter(blog => {
            const title = String(blog.title || '').toLowerCase();
            return productKeywords.some(word => productName.includes(word) && title.includes(word));
          });

          setRelatedBlogs((filteredBlogs.length ? filteredBlogs : safeBlogs).slice(0, 3));
          setLoading(false);
        });
      })
      .catch(err => {
        console.error('Помилка завантаження товару:', err);
        setError(true);
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, [productId]);

  const handleReviewSubmit = async (formDataFromModal) => {
    const newReview = {
      id: Date.now(),
      author: formDataFromModal.name,
      text: formDataFromModal.comment,
      rating: formDataFromModal.rating,
      date: new Date().toLocaleDateString('uk-UA'),
    };

    const updatedReviews = [...(product.reviews || []), newReview];
    const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverageRating = Math.round(totalRating / updatedReviews.length);

    try {
      const response = await fetch(`${PRODUCTS_URL}/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviews: updatedReviews,
          rating: newAverageRating,
        }),
      });

      if (response.ok) {
        setProduct({ ...product, reviews: updatedReviews, rating: newAverageRating });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Помилка оновлення відгуків:', err);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollCarousel = (ref, direction) => {
    ref.current?.scrollBy({
      left: direction === 'left' ? -340 : 340,
      behavior: 'smooth',
    });
  };

  if (loading) return null;

  if (error || !product) {
    return (
      <div className="product-page-container">
        <div className="product-page-main product-not-found">
          <h1>404</h1>
          <h2>Товар не знайдено</h2>
          <p>Вибачте, але товару за цим посиланням не існує. Можливо, він був видалений.</p>
          <Link to="/" className="teal-btn">Повернутися до магазину</Link>
        </div>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [product.image].filter(Boolean);

  return (
    <div className="product-page-container">
      <main className="product-page-main">
        <Breadcrumb customLabels={{ [productId]: product.name }} />

        <section className="product-hero">
          <ProductGallery images={productImages} />
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
                alert('Тільки для зареєстрованих користувачів!');
                return;
              }
              setIsModalOpen(true);
            }}
          />
        </section>

        <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleReviewSubmit} />

        <section id="similar" className="product-carousel-section">
          <h2 className="product-section-title">Схожі товари</h2>
          <div className="product-carousel-shell">
            <button className="product-carousel-btn product-carousel-btn-prev" onClick={() => scrollCarousel(carouselRef, 'left')} aria-label="Попередні товари">&#8249;</button>
            <div className="product-carousel" ref={carouselRef}>
              {similarProducts.map(item => (
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
                {recentItems.map(item => (
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
