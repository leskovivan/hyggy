import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// Видаляємо імпорт статичного масиву products
import ItemCard from '../components/ItemCard'; 
import Breadcrumb from '../components/Breadcrumb';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryName } = useParams();
  
  // Створюємо стейт для товарів та завантаження
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Починаємо завантаження

    // Запитуємо у сервера товари конкретної категорії
    // json-server дозволяє фільтрувати через query-параметри (?category=назва)
    fetch(`http://localhost:3001/products?category=${categoryName.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredProducts(data);
        setIsLoading(false); // Закінчуємо завантаження
      })
      .catch((err) => {
        console.error("Помилка завантаження товарів:", err);
        setIsLoading(false);
      });
  }, [categoryName]); // Перезапускати, якщо змінилася категорія в URL

  return (
    <div className="container">
      <div className='category-page-container'>
        <Breadcrumb />
        
        <h1 className="category-title">
          {categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}
        </h1>

        {isLoading ? (
          <div className="loading-spinner">Завантаження товарів...</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ItemCard key={item.id} product={item} />
              ))
            ) : (
              <p>У цій категорії поки що немає товарів.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;