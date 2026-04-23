import React, { useRef, useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import './ProductPage.css';

import ItemCard from '../components/ItemCard';
import ProductGallery from '../components/ProductGallery';
import ProductMainInfo from '../components/ProductMainInfo';
import ProductReviews from '../components/ProductReviews';
import ProductSpecs from '../components/ProductSpecs';
import Breadcrumb from '../components/Breadcrumb';

const ProductPage = () => {
  const { productId } = useParams();
  
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [recentItems, setRecentItems] = useState([]); // Стейт для переглянутих
  const [loading, setLoading] = useState(true);

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

      // Завантажуємо дані для блоку "Нещодавно переглянуті" (крім поточного)
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

  // Завантаження основного товару
  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3001/products/${productId}`)
      .then(res => res.json())
      .then(currentProduct => {
        setProduct(currentProduct);
        
        fetch(`http://localhost:3001/products?category=${currentProduct.category}&id_ne=${currentProduct.id}&_limit=6`)
          .then(res => res.json())
          .then(similars => {
            setSimilarProducts(similars);
            setLoading(false);
          });
      })
      .catch(err => {
        console.error("Помилка БД:", err);
        setLoading(false);
      });
      
    window.scrollTo(0, 0); 
  }, [productId]);

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
  if (!product) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Товар не знайдено</h2>;

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
              <div className="feature-grid-extra">
                <h3 className="extra-title">Пов'язані статті</h3>
                <div className="extra-cards-row">
                  <div className="extra-card">
                    <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80" alt="Блог 1" />
                    <p>5 ідей по організації простору</p>
                  </div>
                </div>
              </div>
              <div className="feature-grid-media">
                <img src={product.images?.[0] || product.image} alt={product.name} />
              </div>
            </div>
          </section>

          <section id="specs" className="product-section">
            <ProductSpecs specs={product.characteristics} />
          </section>

          <section id="reviews" className="product-section">
            <ProductReviews reviews={product.reviews} />
          </section>
        </div>

        {/* СХОЖІ ТОВАРИ */}
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

        {/* ОСТАННІ ПЕРЕГЛЯНУТІ (Блок, який ми додали) */}
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