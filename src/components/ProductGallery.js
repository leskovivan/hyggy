import React, { useState, useEffect } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images = [] }) => {
  // Встановлюємо перше фото як активне
  const [activeImage, setActiveImage] = useState(images[0]);

  // Якщо пропси змінилися (перейшли на інший товар), оновлюємо головне фото
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="gallery-placeholder">Зображення відсутні</div>;
  }

  return (
    <div className="product-gallery">
      {/* ЛІВА ЧАСТИНА: Головне вікно + Мініатюри */}
      <div className="gallery-main">
        <div className="main-image-container">
          <img 
            className="main-image" 
            src={activeImage || images[0]} 
            alt="Основний ракурс товару" 
          />
        </div>
        
        {/* Рядок мініатюр (тільки якщо фото більше одного) */}
        {images.length > 1 && (
          <div className="thumbnails-row">
            {images.map((img, index) => (
              <div 
                key={index}
                className={`thumb-wrapper ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              >
                <img src={img} alt={`Ракурс ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ПРАВА ЧАСТИНА: Додатковий великий ракурс (як на твоїх макетах) */}
      <div className="gallery-secondary">
        {images.length > 1 ? (
          <img 
            className="secondary-image" 
            src={images[1]} 
            alt="Додатковий ракурс в інтер'єрі" 
          />
        ) : (
          /* Якщо фото лише одне, можна показати заглушку або залишити порожнім */
          <div className="secondary-placeholder">
            <span>HYGGY Design</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGallery;