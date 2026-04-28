import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ItemCard from '../components/ItemCard';
import categories from './categoriesData';
import { products as fallbackProducts } from './products';
import './CategoryPage.css';

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

const ARTICLES = [
  {
    image: '/images/bedroom.png',
    title: 'Створіть затишний дім: 5 порад з вибору меблів для різних кімнат',
    text: 'Вибір меблів для вашого будинку - це не тільки питання стилю, але й комфорту та функціональності.',
  },
  {
    image: '/images/office.png',
    title: 'Як правильно вибрати освітлення для різних кімнат вашої оселі',
    text: 'Освітлення відіграє ключову роль у створенні комфортної атмосфери та підкреслює характер інтер’єру.',
  },
];

const getCategoryTitle = (slug) => {
  const category = categories.find((item) => item.slug === slug);
  return category?.title || 'Категорія';
};

const normalizeProduct = (product, categoryName) => ({
  ...product,
  category: product.category || categoryName,
  image: product.image || product.images?.[0] || '/images/product-chair.png',
  brand: product.brand || 'BISTRUP',
  name: product.name || 'Стілець обідній BISTRUP оливковий/дуб',
  rating: product.rating ?? 5,
});

const CategoryPage = () => {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName || '');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const categoryTitle = getCategoryTitle(decodedCategory);

  useEffect(() => {
    setIsLoading(true);

    fetch(`http://localhost:3001/products?category=${decodedCategory}`)
      .then((response) => response.json())
      .then((data) => {
        const source = Array.isArray(data) ? data : [];
        setProducts(source.map((product) => normalizeProduct(product, decodedCategory)));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Помилка завантаження товарів:', error);
        const fallback = fallbackProducts
          .filter((product) => product.category === decodedCategory)
          .map((product) => normalizeProduct(product, decodedCategory));

        setProducts(fallback);
        setIsLoading(false);
      });
  }, [decodedCategory]);

  const visibleProducts = useMemo(() => {
    if (products.length) return products;

    return fallbackProducts
      .filter((product) => product.category === decodedCategory)
      .map((product) => normalizeProduct(product, decodedCategory));
  }, [decodedCategory, products]);

  return (
    <main className="category-page">
      <div className="category-page-container">
        <div className="category-breadcrumb-wrap">
          <Breadcrumb customLabels={{ category: 'Категорії', [decodedCategory]: categoryTitle }} />
        </div>

        <header className="category-page-heading">
          <h1 className="category-title">{categoryTitle}</h1>
          <h2 className="category-subtitle">Товари</h2>
        </header>

        {isLoading ? (
          <div className="category-state">Завантаження товарів...</div>
        ) : (
          <div className="category-products-grid">
            {visibleProducts.length > 0 ? (
              visibleProducts.map((item) => (
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
          {ARTICLES.map((article) => (
            <article className="category-article-card" key={article.title}>
              <div className="category-article-image">
                <img src={article.image} alt="" />
                <h3>{article.title}</h3>
              </div>
              <p>{article.text}</p>
            </article>
          ))}
        </div>
        <button className="category-articles-arrow category-articles-arrow--right" type="button" aria-label="Наступна стаття">
          <span />
        </button>
      </section>
    </main>
  );
};

export default CategoryPage;
