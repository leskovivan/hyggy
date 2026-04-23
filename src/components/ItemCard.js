import React from 'react';
import { Link } from 'react-router-dom';
import './ItemCard.css';
import Breadcrumb from './Breadcrumb';

// Міні-компонент зірочки (менший розмір для карточки)
const StarIcon = ({ width = 14, height = 14, fill = "black" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 43 43" fill="none">
    <path d="M39.3888 19.2124L31.8134 25.8237L34.0827 35.6666C34.2028 36.1812 34.1685 36.7197 33.9842 37.2149C33.7998 37.7101 33.4736 38.14 33.0463 38.4508C32.619 38.7616 32.1096 38.9395 31.5817 38.9624C31.0538 38.9852 30.5309 38.8519 30.0783 38.5792L21.4934 33.3722L12.927 38.5792C12.4745 38.8519 11.9515 38.9852 11.4236 38.9624C10.8958 38.9395 10.3863 38.7616 9.95899 38.4508C9.53168 38.14 9.20547 37.7101 9.02114 37.2149C8.83682 36.7197 8.80255 36.1812 8.92263 35.6666L11.1885 25.8337L3.61146 19.2124C3.2107 18.8668 2.92091 18.4105 2.77843 17.9008C2.63595 17.3911 2.64712 16.8507 2.81054 16.3474C2.97396 15.844 3.28236 15.4001 3.69706 15.0713C4.11176 14.7426 4.6143 14.5435 5.14166 14.4992L15.1291 13.6342L19.0276 4.33543C19.2312 3.8475 19.5746 3.43073 20.0146 3.13757C20.4546 2.84441 20.9714 2.68799 21.5001 2.68799C22.0288 2.68799 22.5457 2.84441 22.9857 3.13757C23.4256 3.43073 23.769 3.8475 23.9726 4.33543L27.8829 13.6342L37.867 14.4992C38.3944 14.5435 38.8969 14.7426 39.3116 15.0713C39.7263 15.4001 40.0347 15.844 40.1981 16.3474C40.3615 16.8507 40.3727 17.3911 40.2302 17.9008C40.0878 18.4105 39.798 18.8668 39.3972 19.2124H39.3888Z" fill={fill}/>
  </svg>
);

const ItemCard = ({ product }) => {
  // Вираховуємо відсоток знижки
  const discountPercent = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  // Вираховуємо середній рейтинг для карточки
  const hasReviews = product.reviews && product.reviews.length > 0;
  const averageRating = hasReviews 
    ? Math.round(product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length) 
    : 0; // Якщо відгуків немає, рейтинг 0

  return (
    <Link to={`/category/${product.category}/${product.id}`} className="item-card-link">
      <div className="item-card">
        <div className="item-card__image-box">
          <button className="item-card__favorite-btn" onClick={(e) => e.preventDefault()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <img src={product.image} alt={product.name} className="item-card__image" />
          <div className="item-card__badges">
            {product.oldPrice && <span className="badge badge--discount">-{discountPercent}%</span>}
            {product.isNew && <span className="badge badge--new">Новинка</span>}
          </div>
        </div>

        <div className="item-card__info">
          <div className="item-card__brand">{product.brand}</div>
          <h3 className="item-card__name">{product.name}</h3>
          
          {/* НОВИЙ БЛОК ЗІРОК */}
          <div className="item-card__stars">
            <div className="item-card__stars-icons">
              {[...Array(5)].map((_, index) => (
                <StarIcon 
                  key={index} 
                  fill={index < averageRating ? "black" : "#e0e0e0"} 
                />
              ))}
            </div>
            {/* Показуємо кількість відгуків (за бажанням) */}
            <span className="item-card__reviews-count">
              {hasReviews ? `(${product.reviews.length})` : ''}
            </span>
          </div>

          <div className="item-card__prices">
            <div className="price-current">{product.price}$<span className="price-unit">/шт.</span></div>
            {product.oldPrice && <div className="price-old">{product.oldPrice}$</div>}
          </div>

          <ul className="item-card__statuses">
            <li className="status-item">
              <span className={`status-dot ${product.hasDelivery ? 'dot-green' : 'dot-red'}`}></span>
              Доставка
            </li>
            <li className="status-item">
              <span className={`status-dot ${product.inStock ? 'dot-green' : 'dot-red'}`}></span>
              {product.inStock ? 'В наявності' : 'Немає в наявності'}
            </li>
          </ul>
        </div>
      </div>
    </Link>
  );
};

export default ItemCard;