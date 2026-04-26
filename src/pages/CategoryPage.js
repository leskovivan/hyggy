import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ItemCard from '../components/ItemCard'; 
import Breadcrumb from '../components/Breadcrumb';
import './CategoryPage.css';

const CATEGORY_LABELS = {
  kitchen: 'Кухня',
  bedroom: 'Спальня',
  'living-room': 'Вітальня',
  office: 'Офіс',
  bathroom: 'Ванна',
  garden: 'Для саду',
};

const BRAND_CARDS = [
  {
    logo: '/images/Hastens.png',
    alt: 'Hastens',
    text: 'Бренд, відомий своїми розкішними матрацами, які роблять із натуральних матеріалів з акцентом на якість та комфорт.',
  },
  {
    logo: '/images/Svenska.png',
    alt: 'Svenska',
    text: 'Бренд пропонує широкий вибір меблів та товарів для дому, що поєднують стиль та функціональність.',
  },
  {
    logo: '/images/Fritz.png',
    alt: 'Fritz Hansen',
    text: 'Знаменита меблева компанія, що виробляє дизайнерські меблі та аксесуари, включаючи культові вироби від відомих дизайнерів.',
  },
  {
    logo: '/images/muuto.png',
    alt: 'Muuto',
    text: 'Пропонує сучасні меблі, освітлення та аксесуари з акцентом на скандинавський дизайн та простоту.',
  },
];

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const decodedCategory = decodeURIComponent(categoryName || '');
  const categoryTitle = CATEGORY_LABELS[decodedCategory] || 'Категорія';

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://localhost:3001/products?category=${decodedCategory.toLowerCase()}`)
      .then((res) => res.json())
      .then((data) => {
        setFilteredProducts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Помилка завантаження товарів:', err);
        setIsLoading(false);
      });
  }, [decodedCategory]);

  return (
    <main className="category-page">
      <div className="category-page-container">
        <div className="category-breadcrumb-wrap">
          <Breadcrumb customLabels={{ [decodedCategory]: categoryTitle }} />
        </div>

        <header className="category-page-heading">
          <h1 className="category-title">{categoryTitle}</h1>
          <h2 className="category-subtitle">Товари</h2>
        </header>

        {isLoading ? (
          <div className="category-state">Завантаження товарів...</div>
        ) : (
          <div className="category-products-grid">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <ItemCard key={item.id} product={item} />
              ))
            ) : (
              <p className="category-state">У цій категорії поки що немає товарів.</p>
            )}
          </div>
        )}
      </div>

      <section className="category-brands" aria-label="Бренди">
        <div className="category-brands-grid">
          {BRAND_CARDS.map((brand) => (
            <article className="category-brand-card" key={brand.alt}>
              <div className="category-brand-logo-wrap">
                <img src={brand.logo} alt={brand.alt} className="category-brand-logo" />
              </div>
              <p>{brand.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="category-articles" aria-label="Статті">
        <button className="category-articles-arrow category-articles-arrow--left" type="button" aria-label="Попередня стаття">
          <span />
        </button>
        <div className="category-articles-track">
          <article className="category-article-card">
            <div className="category-article-image">
              <img src="/images/bedroom.png" alt="Інтер'єр спальні" />
              <h3>Створіть затишний дім: 5 порад з вибору меблів для різних кімнат</h3>
            </div>
            <p>Вибір меблів для вашого будинку - це не тільки питання стилю, але й комфорту та функціональності.</p>
          </article>
          <article className="category-article-card">
            <div className="category-article-image">
              <img src="/images/office.png" alt="Сучасний інтер'єр" />
              <h3>Як правильно вибрати освітлення для різних кімнат вашої оселі</h3>
            </div>
            <p>Освітлення відіграє ключову роль у створенні комфортної атмосфери у вашому будинку.</p>
          </article>
        </div>
        <button className="category-articles-arrow category-articles-arrow--right" type="button" aria-label="Наступна стаття">
          <span />
        </button>
      </section>
    </main>
  );
};

export default CategoryPage;
