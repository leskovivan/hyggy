import React from 'react';
import { useParams } from 'react-router-dom';
import { products } from './products'; // Твой массив со всеми товарами
import ItemCard from '../components/ItemCard'; // Твой компонент карточки товара

const CategoryPage = () => {
  // Вытаскиваем название категории из URL (например, "kitchen")
  const { categoryName } = useParams();

  // Фильтруем товары: оставляем только те, где категория совпадает с URL
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryName.toLowerCase()
  );

  return (
    <div className="container">
      <h1 className="category-title">
        {/* Делаем первую букву заглавной для красоты */}
        {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
      </h1>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <ItemCard key={item.id} product={item} />
          ))
        ) : (
          <p>У цій категорії поки що немає товарів.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;