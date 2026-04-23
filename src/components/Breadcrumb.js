import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const Breadcrumb = ({ customLabels = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Стейт для збереження перекладів із бази
  const [translations, setTranslations] = useState(null);

  // Завантажуємо переклади при старті компонента
  useEffect(() => {
    fetch('http://localhost:3001/translations')
      .then((res) => res.json())
      .then((data) => {
        setTranslations(data);
      })
      .catch((err) => console.error("Помилка завантаження перекладів:", err));
  }, []);

  // Не показуємо нічого на головній або поки дані ще вантажаться
  if (location.pathname === '/' || !translations) {
    return null;
  }

  return (
    <div className="breadcrumb">
      {/* "Домашня сторінка" тепер теж може бути в перекладах або залишитись так */}
      <Link to="/" className="breadcrumb-link">
        {translations.routes['/'] || 'Домашня сторінка'}
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // ПРІОРИТЕТИ ПОШУКУ НАЗВИ:
        // 1. customLabels[value] — назва товару (передаємо з ProductPage)
        // 2. translations.routes[value] — статичні сторінки (blog, shops...)
        // 3. translations.categories[value] — назви категорій (kitchen, bedroom...)
        // 4. value — якщо нічого не знайдено, виводимо текст із URL
        const name = 
          customLabels[value] || 
          translations.routes[value] || 
          translations.categories[value] || 
          value;

        return (
          <span key={to} className="breadcrumb-item">
            <span className="breadcrumb-separator"> {'>'} </span>
            {isLast ? (
              <span className="breadcrumb-current">{name}</span>
            ) : (
              <Link to={to} className="breadcrumb-link">
                {name}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumb;