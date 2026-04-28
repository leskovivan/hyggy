import React from 'react';
import './ProductReviews.css';

const StarIcon = ({ fill = 'black', small = false }) => (
  <svg className={small ? 'review-star-small' : ''} viewBox="0 0 43 43" aria-hidden="true">
    <path d="M39.3888 19.2124L31.8134 25.8237L34.0827 35.6666C34.2028 36.1812 34.1685 36.7197 33.9842 37.2149C33.7998 37.7101 33.4736 38.14 33.0463 38.4508C32.619 38.7616 32.1096 38.9395 31.5817 38.9624C31.0538 38.9852 30.5309 38.8519 30.0783 38.5792L21.4934 33.3722L12.927 38.5792C12.4745 38.8519 11.9515 38.9852 11.4236 38.9624C10.8958 38.9395 10.3863 38.7616 9.95899 38.4508C9.53168 38.14 9.20547 37.7101 9.02114 37.2149C8.83682 36.7197 8.80255 36.1812 8.92263 35.6666L11.1885 25.8337L3.61146 19.2124C3.2107 18.8668 2.92091 18.4105 2.77843 17.9008C2.63595 17.3911 2.64712 16.8507 2.81054 16.3474C2.97396 15.844 3.28236 15.4001 3.69706 15.0713C4.11176 14.7426 4.6143 14.5435 5.14166 14.4992L15.1291 13.6342L19.0276 4.33543C19.2312 3.8475 19.5746 3.43073 20.0146 3.13757C20.4546 2.84441 20.9714 2.68799 21.5001 2.68799C22.0288 2.68799 22.5457 2.84441 22.9857 3.13757C23.4256 3.43073 23.769 3.8475 23.9726 4.33543L27.8829 13.6342L37.867 14.4992C38.3944 14.5435 38.8969 14.7426 39.3116 15.0713C39.7263 15.4001 40.0347 15.844 40.1981 16.3474C40.3615 16.8507 40.3727 17.3911 40.2302 17.9008C40.0878 18.4105 39.798 18.8668 39.3972 19.2124H39.3888Z" fill={fill} />
  </svg>
);

const ProductReviews = ({ reviews = [], onOpenModal }) => {
  const averageRating = reviews.length
    ? Math.round(reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length)
    : 5;

  return (
    <div className="product-reviews-container">
      <h2 className="product-reviews-title">Відгуки</h2>

      <div className="product-reviews-content">
        <div className="reviews-header">
          <div className="overall-rating">
            <div className="stars-group">
              {[...Array(5)].map((_, index) => (
                <StarIcon key={index} fill={index < averageRating ? 'black' : '#e0e0e0'} />
              ))}
            </div>
            <span className="score-bold">{averageRating}/5</span>
            <span className="score-text">Оцінка користувачів</span>
          </div>

          <button className="write-review-btn" type="button" onClick={onOpenModal}>
            Залишити відгук
          </button>
        </div>

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <article key={review.id || index} className="review-item">
                <div className="review-author-col">
                  <h4>{review.author || review.name || 'Користувач'}</h4>
                  <div className="review-author-rating">
                    <div className="stars-group">
                      {[...Array(5)].map((_, starIndex) => (
                        <StarIcon key={starIndex} small fill={starIndex < Number(review.rating || 0) ? 'black' : '#e0e0e0'} />
                      ))}
                    </div>
                    <span>{review.rating || 0}/5</span>
                  </div>
                </div>
                <p>{review.text || review.comment}</p>
              </article>
            ))
          ) : (
            <p className="reviews-empty">Поки що немає відгуків. Будьте першим!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
