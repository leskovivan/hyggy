import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { products } from './products';
import './ProductPage.css';

// Импортируем наши блоки
import ItemCard from '../components/ItemCard';
import ProductGallery from '../components/ProductGallery';
import ProductMainInfo from '../components/ProductMainInfo';
import ProductReviews from '../components/ProductReviews';
import ProductSpecs from '../components/ProductSpecs';
import Breadcrumb from '../components/Breadcrumb';

const ProductPage = () => {
  const { categoryName, productId } = useParams();
  
  // Ищем товар
  const product = products.find(p => p.id === parseInt(productId));

  // 1. Реф для каруселі
  const carouselRef = useRef(null);

  if (!product) return <h2>Товар не знайдено</h2>;

  // Ищем похожие товары
  const similarProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  // Функція плавного скролу до секцій
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // 2. Функція для прокрутки каруселі вліво/вправо
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 320; 
      carouselRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="product-page-container">
      
      {/* --- ВЕРХНЯ ЧАСТИНА (Галерея та Інфо) --- */}
      <div className='product-page-main'>
        <Breadcrumb />
        <div className="product-top-section" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px', marginBottom: '60px' }}>
          <ProductGallery images={product.images} />
          <ProductMainInfo product={product} />
        </div>
      </div>

      {/* --- НАВІГАЦІЯ (Синя лінія) --- */}
      <div className="blue-line">
        <div className="product-page-main tabs-wrapper">
          <span className="tab-item" onClick={() => scrollToSection('desc')}>Опис</span>
          <span className="tab-item" onClick={() => scrollToSection('specs')}>Характеристики</span>
          <span className="tab-item" onClick={() => scrollToSection('reviews')}>Відгуки</span>
          <span className="tab-item" onClick={() => scrollToSection('similar')}>Схожі товари</span>
        </div>
      </div>

      {/* --- ОСНОВНИЙ КОНТЕНТ СТОРІНКИ --- */}
      <div className="product-page-main">
        <div className="product-details-section">

          {/* ОПИС (додано id="desc") */}
          <section id="desc" className="product-feature-section">
            <h2 className="section-title">Опис</h2>
            <div className="feature-grid">
              
              <div className="feature-grid-text">
                <p>{product.description}</p>
                <p className="feature-article">
                  <strong>Артикул: {product.article}</strong>
                </p>
              </div>

              <div className="feature-grid-extra">
                <h3 className="extra-title">Пов'язані статті в блозі</h3>
                <div className="extra-cards-row">
                  <div className="extra-card">
                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" alt="Блог 1" />
                    <p>5 ідей по організації простору</p>
                  </div>
                  <div className="extra-card">
                    <img src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&q=80" alt="Блог 2" />
                    <p>Барвисті обідні стільці для сучасної оселі</p>
                  </div>
                </div>
              </div>

              <div className="feature-grid-media">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : ''} 
                  alt={`Фото в інтер'єрі ${product.name}`} 
                />
              </div>

            </div>
          </section>

          {/* ХАРАКТЕРИСТИКИ */}
          <section id="specs" className="product-section">
            <ProductSpecs specs={product.characteristics} />
          </section>

          {/* ВІДГУКИ */}
          <section id="reviews" className="product-section">
            <ProductReviews reviews={product.reviews} />
          </section>

        </div>

        {/* --- СХОЖІ ТОВАРИ (Карусель) --- */}
        <section id="similar" className="similar-products-section">
        <h2 className="section-title">Схожі товари</h2>
        
        <div className="carousel-wrapper">
          
          {/* Показуємо кнопку "Назад" ТІЛЬКИ якщо є товари */}
          {similarProducts.length > 0 && (
            <button className="carousel-btn prev" onClick={() => scrollCarousel('left')}>
              &#8249;
            </button>
          )}

          <div className="similar-products-carousel" ref={carouselRef}>
            {similarProducts.length > 0 ? (
              similarProducts.map(item => (
                <div className="carousel-item" key={item.id}>
                  <ItemCard product={item} />
                </div>
              ))
            ) : (
              <p className="no-products-msg">Схожих товарів поки немає.</p>
            )}
          </div>

          {/* Показуємо кнопку "Вперед" ТІЛЬКИ якщо є товари */}
          {similarProducts.length > 0 && (
            <button className="carousel-btn next" onClick={() => scrollCarousel('right')}>
              &#8250;
            </button>
          )}
          
        </div>
      </section>

      </div>
    </div>
  );
};

export default ProductPage;