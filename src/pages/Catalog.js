import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import categories from './categoriesData';
import './Catalog.css';

const CatalogPage = () => {
  return (
    <main className="catalog-page">
      <div className="catalog-page__container">
        <Breadcrumb customLabels={{ category: 'Категорії' }} />

        <h1 className="catalog-page__title">Категорії</h1>

        <section className="catalog-page__grid" aria-label="Категорії товарів">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="catalog-category-card"
            >
              <img
                className="catalog-category-card__image"
                src={category.img}
                alt={category.title}
              />
              <span className="catalog-category-card__title">{category.title}</span>
            </Link>
          ))}
        </section>

        <nav className="catalog-pagination" aria-label="Пагінація категорій">
          <button type="button" aria-label="Попередня сторінка">{'<'}</button>
          <button type="button" className="is-active">1</button>
          <button type="button">2</button>
          <span>...</span>
          <button type="button">10</button>
          <button type="button" aria-label="Наступна сторінка">{'>'}</button>
        </nav>
      </div>
    </main>
  );
};

export default CatalogPage;
