import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

// Твої статичні шляхи (я додав сюди /category)
const routeNames = {
  '/': 'Домашня сторінка',
  '/blog': 'Блог',
  '/shops': 'Магазини',
  '/qa': 'Питання та відповіді',
  '/work': 'Робота',
  '/about': 'Про нас',
  '/category': 'Категорії', 
};

// Словник для перекладу англійських назв категорій у URL
const categoryTranslations = {
  'bedroom': 'Спальня',
  'bathroom': 'Ванна',
  'office': 'Офіс',
  'living-room': 'Вітальня',
  'kitchen': 'Кухня',
  'garden': 'Для саду'
};

// Додали пропс customLabels (порожній об'єкт за замовчуванням)
const Breadcrumb = ({ customLabels = {} }) => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') {
    return null; // Не показуємо на головній
  }

  return (
    <div className="breadcrumb">
      <Link to="/" className="breadcrumb-link">
        {routeNames['/']}
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        // МАГІЯ ТУТ: Як ми визначаємо, що написати?
        // 1. Шукаємо, чи не передали нам кастомну назву (наприклад, ім'я товару для його ID)
        // 2. Якщо ні, шукаємо у твоїх статичних routeNames
        // 3. Якщо ні, шукаємо в перекладах категорій
        // 4. Якщо взагалі нічого немає — виводимо сам value з URL
        const name = customLabels[value] || routeNames[to] || categoryTranslations[value] || value;

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