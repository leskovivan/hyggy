import React from 'react';
import './ProductSpecs.css'; // Обязательно подключаем стили

const ProductSpecs = ({ specs }) => {
  // Если характеристик нет, просто ничего не показываем
  if (!specs || specs.length === 0) return null;

  return (
    <div className="product-specs-container">
      <h2 className="product-specs-title">Характеристики</h2>
      
      <table className="product-specs-table">
        <tbody>
          {specs.map((item, index) => (
            <tr key={index}>
              <td className="spec-label">{item.label}</td>
              <td className="spec-value">{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductSpecs;