import React, { useState } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images || images.length === 0) return null;

  return (
    <div className="product-gallery">
      
      {/* Ліва колонка: Головне фото + мініатюри */}
      <div className="gallery-left">
        <img className="main-image" src={activeImage} alt="Головне фото" />
        <div className="thumbnails">
          {images.map((img, index) => (
            <img 
              key={index}
              className={`thumb ${activeImage === img ? 'active' : ''}`}
              src={img} 
              alt={`Мініатюра ${index + 1}`} 
              onClick={() => setActiveImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Права колонка: Додаткове фото */}
      <div className="gallery-right">
        {images.length > 1 && (
          <img className="side-image" src={images[1]} alt="Додатковий ракурс" />
        )}
      </div>
      
    </div>
  );
};

export default ProductGallery;