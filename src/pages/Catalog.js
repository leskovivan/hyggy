import { categories } from './categoriesData';
import CategoryCard from '../components/CategoryCard';
import { Link } from 'react-router-dom';
import './Catalog.css';
import categoriesData from './categoriesData';
import Breadcrumb from '../components/Breadcrumb';

const CatalogPage = () => {
  return (
    <main className="qa-page">
        
    <div className='Catalog-site'>
    <Breadcrumb />
    <h1 className="catalog-page__title">Категорії</h1>
    <div className="home-page__categories-grid">
              {categoriesData.map((category) => (
                <Link key={category.title} to={`/category/${category.slug}`} className="home-page__category-card">
                  <img className="home-page__category-image" src={category.img} alt={category.title} />
                  <span className="home-page__category-label">{category.title}</span>
                </Link>
              ))}
            </div></div></main>
  );
};
export default CatalogPage;
