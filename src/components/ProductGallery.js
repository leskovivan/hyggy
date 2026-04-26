import React, { useEffect, useMemo, useState } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images = [] }) => {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  useEffect(() => {
    setActiveImage(safeImages[0]);
  }, [safeImages]);

  if (!safeImages.length) {
    return <div className="gallery-placeholder">Зображення відсутні</div>;
  }

  const secondaryImage = safeImages[1] || safeImages[0];

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <button
          type="button"
          className="main-image-container"
          aria-label="Головне фото товару"
        >
          <img className="main-image" src={activeImage || safeImages[0]} alt="" />
        </button>

        <div className="thumbnails-row" aria-label="Фото товару">
          {safeImages.slice(0, 4).map((img, index) => (
            <button
              type="button"
              key={`${img}-${index}`}
              className={`thumb-wrapper ${activeImage === img ? 'active' : ''}`}
              onClick={() => setActiveImage(img)}
              aria-label={`Показати фото ${index + 1}`}
            >
              <img src={img} alt="" />
            </button>
          ))}
        </div>
      </div>

      <div className="gallery-secondary">
        <img className="secondary-image" src={secondaryImage} alt="" />
      </div>
    </div>
  );
};

export default ProductGallery;
