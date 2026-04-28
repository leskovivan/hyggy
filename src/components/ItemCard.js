import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ItemCard.css';

const StarIcon = ({ width = 28, height = 28, fill = '#231f20' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 43 43" fill="none">
    <path d="M39.3888 19.2124L31.8134 25.8237L34.0827 35.6666C34.2028 36.1812 34.1685 36.7197 33.9842 37.2149C33.7998 37.7101 33.4736 38.14 33.0463 38.4508C32.619 38.7616 32.1096 38.9395 31.5817 38.9624C31.0538 38.9852 30.5309 38.8519 30.0783 38.5792L21.4934 33.3722L12.927 38.5792C12.4745 38.8519 11.9515 38.9852 11.4236 38.9624C10.8958 38.9395 10.3863 38.7616 9.95899 38.4508C9.53168 38.14 9.20547 37.7101 9.02114 37.2149C8.83682 36.7197 8.80255 36.1812 8.92263 35.6666L11.1885 25.8337L3.61146 19.2124C3.2107 18.8668 2.92091 18.4105 2.77843 17.9008C2.63595 17.3911 2.64712 16.8507 2.81054 16.3474C2.97396 15.844 3.28236 15.4001 3.69706 15.0713C4.11176 14.7426 4.6143 14.5435 5.14166 14.4992L15.1291 13.6342L19.0276 4.33543C19.2312 3.8475 19.5746 3.43073 20.0146 3.13757C20.4546 2.84441 20.9714 2.68799 21.5001 2.68799C22.0288 2.68799 22.5457 2.84441 22.9857 3.13757C23.4256 3.43073 23.769 3.8475 23.9726 4.33543L27.8829 13.6342L37.867 14.4992C38.3944 14.5435 38.8969 14.7426 39.3116 15.0713C39.7263 15.4001 40.0347 15.844 40.1981 16.3474C40.3615 16.8507 40.3727 17.3911 40.2302 17.9008C40.0878 18.4105 39.798 18.8668 39.3972 19.2124H39.3888Z" fill={fill} />
  </svg>
);

const ItemCard = ({ product }) => {
  const { user, toggleFavorite } = useAuth();
  const navigate = useNavigate();

  const image = product.image || product.images?.[0] || '/images/product-chair.png';
  const category = product.category || 'chairs';
  const currentPrice = Number(product.price || 0);
  const discount = Number(product.discountPercent || 0);
  const oldPrice = discount > 0 ? Math.round(currentPrice / (1 - discount / 100)) : null;
  const hasReviews = Array.isArray(product.reviews) && product.reviews.length > 0;
  const averageRating = hasReviews
    ? Math.round(product.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / product.reviews.length)
    : Number(product.rating || 5);
  const isFavorite = user?.favorites?.some((favId) => String(favId) === String(product.id));

  const handleFavoriteClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      alert('Тільки зареєстровані користувачі можуть додавати товари в обране!');
      navigate('/login');
      return;
    }

    toggleFavorite(product.id);
  };

  return (
    <Link to={`/category/${category}/${product.id}`} className="item-card-link">
      <article className="item-card">
        <div className="item-card__image-box">
          <button
            className={`item-card__favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            type="button"
            aria-label={isFavorite ? 'Прибрати з обраного' : 'Додати в обране'}
          >
            <svg viewBox="0 0 46 42" fill={isFavorite ? '#231f20' : 'none'} xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23 39.2C15.7 32.9 9.65 27.2 5.35 22.1C1.35 17.35 1.75 10.25 6.3 6.25C10.75 2.3 17.35 3.05 21.05 7.35L23 9.6L24.95 7.35C28.65 3.05 35.25 2.3 39.7 6.25C44.25 10.25 44.65 17.35 40.65 22.1C36.35 27.2 30.3 32.9 23 39.2Z"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <img src={image} alt={product.name} className="item-card__image" />

          <div className="item-card__badges">
            {discount > 0 && <span className="badge badge--discount">-{discount}%</span>}
            {product.isNew && <span className="badge badge--new">Новинка</span>}
          </div>
        </div>

        <div className="item-card__info">
          <div className="item-card__brand">{product.brand || 'BISTRUP'}</div>
          <h3 className="item-card__name">{product.name || 'Стілець обідній BISTRUP оливковий/дуб'}</h3>

          <div className="item-card__stars">
            <div className="item-card__stars-icons">
              {Array.from({ length: 5 }, (_, index) => (
                <StarIcon key={index} fill={index < averageRating ? '#231f20' : '#e0e0e0'} />
              ))}
            </div>
            {hasReviews && <span className="item-card__reviews-count">({product.reviews.length})</span>}
          </div>

          <div className="item-card__prices">
            <div className="price-current">
              {Math.round(currentPrice)}$<span className="price-unit">/шт.</span>
            </div>
            {oldPrice && (
              <div className="price-old">
                {oldPrice}$<span className="price-unit">/шт.</span>
              </div>
            )}
          </div>

          <ul className="item-card__statuses">
            <li className="status-item">
              <span className="status-dot dot-red" />
              {product.hasDelivery === false ? 'Немає доставки' : 'Доставка'}
            </li>
            <li className="status-item">
              <span className={`status-dot ${product.inStock === false ? 'dot-red' : 'dot-green'}`} />
              {product.inStock === false ? 'Немає в наявності' : 'В наявності'}
            </li>
          </ul>
        </div>
      </article>
    </Link>
  );
};

export default ItemCard;
