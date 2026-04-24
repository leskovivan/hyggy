import React, { useRef, useState, useEffect } from 'react'; 
import { useParams, Link } from 'react-router-dom'; 
import './ProductPage.css';

import ItemCard from '../components/ItemCard';
import ProductGallery from '../components/ProductGallery';
import ProductMainInfo from '../components/ProductMainInfo';
import ProductReviews from '../components/ProductReviews';
import ProductSpecs from '../components/ProductSpecs';
import Breadcrumb from '../components/Breadcrumb';
import ReviewModal from '../components/ReviewModal'; 
import RelatedBlogs from '../components/RelatedBlogs'; 
import { useAuth } from '../context/AuthContext'; 

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

  // --- ЛОГІКА "ОСТАННІ ПЕРЕГЛЯНУТІ" ---
  useEffect(() => {
    if (productId) {
      const rawData = localStorage.getItem('viewedProducts');
      let history = rawData ? JSON.parse(rawData) : [];
      const idToStore = Number(productId);

      history = history.filter(item => Number(item) !== idToStore);
      history.unshift(idToStore);
      const limitedHistory = history.slice(0, 5);
      localStorage.setItem('viewedProducts', JSON.stringify(limitedHistory));

      const idsToShow = limitedHistory.filter(id => Number(id) !== idToStore);
      if (idsToShow.length > 0) {
        const query = idsToShow.map(id => `id=${id}`).join('&');
        fetch(`http://localhost:3001/products?${query}`)
          .then(res => res.json())
          .then(data => setRecentItems(data))
          .catch(err => console.error("Помилка історії:", err));
      }
    }
  }, [productId]);

  // --- ЗАВАНТАЖЕННЯ ТОВАРУ ТА ФІЛЬТРОВАНИХ БЛОГІВ ---
  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`http://localhost:3001/products/${productId}`)
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
          fetch(`http://localhost:3001/products?category=${currentProduct.category}`).then(r => r.json()),
          fetch(`http://localhost:3001/blogs`).then(r => r.json())
        ]).then(([allSimilars, allBlogs]) => {
          // Схожі товари за категорією
          setSimilarProducts(allSimilars.filter(p => String(p.id) !== String(productId)).slice(0, 6));
          
          // --- ЛОГІКА ПОШУКУ СТАТЕЙ ЗА НАЗВОЮ ---
          const productName = currentProduct.name.toLowerCase();
          const keywords = ['стілець', 'стіл', 'диван', 'ліжко', 'шафа', 'кухня', 'вітальня'];
          
          const filteredBlogs = allBlogs.filter(blog => {
            const blogTitle = blog.title.toLowerCase();
            // Шукаємо, чи є в назві товару та в заголовку блогу одне й те саме ключове слово
            return keywords.some(word => 
              productName.includes(word) && blogTitle.includes(word)
            );
          }).slice(0, 3);
            
          // Якщо збігів не знайдено, показуємо перші 3 статті як дефолт
          if (filteredBlogs.length === 0) {
            setRelatedBlogs(allBlogs.slice(0, 3));
          } else {
            setRelatedBlogs(filteredBlogs);
          }

          setLoading(false);
        });
      })
      .catch(err => {
        console.error("Помилка завантаження:", err);
        setError(true);
        setLoading(false);
      });
      
    window.scrollTo(0, 0);
  }, [productId]);

  // --- ОБРОБКА ВІДГУКУ З СИНХРОНІЗАЦІЄЮ РЕЙТИНГУ ---
  const handleReviewSubmit = async (formDataFromModal) => {
    const newReview = {
      id: Date.now(),
      author: formDataFromModal.name,
      text: formDataFromModal.comment,
      rating: formDataFromModal.rating,
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [...(product.reviews || []), newReview];
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAverageRating = Math.round(totalRating / updatedReviews.length);

    try {
      const res = await fetch(`http://localhost:3001/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reviews: updatedReviews,
          rating: newAverageRating
        })
      });

      if (res.ok) {
        setProduct({ ...product, reviews: updatedReviews, rating: newAverageRating });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Помилка оновлення:", err);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (loading) return null;

  if (error || !product) {
    return (
      <div className="product-page-main" style={{ textAlign: 'center', padding: '120px 20px' }}>
        <h1 style={{ fontSize: '120px', color: '#00aaad', margin: 0 }}>404</h1>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Товар не знайдено</h2>
        <p style={{ color: '#666', marginBottom: '40px' }}>Вибачте, але товару за цим посиланням не існує. Можливо, він був видалений.</p>
        <Link to="/" className="teal-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Повернутися до магазину</Link>
      </div>
    );
  }

  return (
    <div className="product-page-container">
      <div className='product-page-main'>
        <Breadcrumb customLabels={{ [productId]: product.name }} />
        
        <div className="product-top-section" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', marginBottom: '60px' }}>
          <ProductGallery images={product.images || [product.image]} />
          <ProductMainInfo product={product} />
        </div>
      </div>

      <div className="blue-line">
        <div className="product-page-main tabs-wrapper">
          <span className="tab-item" onClick={() => scrollToSection('desc')}>Опис</span>
          <span className="tab-item" onClick={() => scrollToSection('specs')}>Характеристики</span>
          <span className="tab-item" onClick={() => scrollToSection('reviews')}>Відгуки</span>
          <span className="tab-item" onClick={() => scrollToSection('similar')}>Схожі товари</span>
        </div>
      </div>

      <div className="product-page-main">
        <div className="product-details-section">
          <section id="desc" className="product-feature-section">
            <h2 className="section-title">Опис</h2>
            <div className="feature-grid">
              <div className="feature-grid-text">
                <p>{product.description}</p>
                <p className="feature-article"><strong>Артикул: {product.article}</strong></p>
              </div>
              
              <RelatedBlogs blogs={relatedBlogs} />

              <div className="feature-grid-media">
                <img src={product.images?.[0] || product.image} alt={product.name} />
              </div>
            </div>
          </section>

          <section id="specs" className="product-section">
            <ProductSpecs specs={product.characteristics} />
          </section>

          <section id="reviews" className="product-section">
            <ProductReviews reviews={product.reviews} onOpenModal={() => {
              if (!user) return alert("Тільки для зареєстрованих користувачів!");
              setIsModalOpen(true);
            }} />
          </section>
        </div>

        <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleReviewSubmit} />

        <section id="similar" className="similar-products-section">
          <h2 className="section-title">Схожі товари</h2>
          <div className="carousel-wrapper">
            <button className="carousel-btn prev" onClick={() => scrollCarousel(carouselRef, 'left')}>&#8249;</button>
            <div className="similar-products-carousel" ref={carouselRef}>
              {similarProducts.map(item => (
                <div className="carousel-item" key={item.id}><ItemCard product={item} /></div>
              ))}
            </div>
            <button className="carousel-btn next" onClick={() => scrollCarousel(carouselRef, 'right')}>&#8250;</button>
          </div>
        </section>

        {recentItems.length > 0 && (
          <section className="similar-products-section recent-items-block">
            <h2 className="section-title">Ви нещодавно переглядали</h2>
            <div className="carousel-wrapper">
              <button className="carousel-btn prev" onClick={() => scrollCarousel(recentCarouselRef, 'left')}>&#8249;</button>
              <div className="similar-products-carousel" ref={recentCarouselRef}>
                {recentItems.map(item => (
                  <div className="carousel-item" key={item.id}><ItemCard product={item} /></div>
                ))}
              </div>
              <button className="carousel-btn next" onClick={() => scrollCarousel(recentCarouselRef, 'right')}>&#8250;</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductPage;