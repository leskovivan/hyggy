import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const fallbackRoutes = {
  '/': 'Домашня сторінка',
  blog: 'Блог',
  shops: 'Магазини',
  qa: 'Питання-відповідь',
  work: 'Робота',
  about: 'Про нас',
  'about-us': 'Про нас',
  category: 'Категорії',
  search: 'Пошук',
  cart: 'Кошик',
  checkout: 'Оформлення замовлення',
  login: 'Вхід',
  register: 'Реєстрація',
  confirm: 'Підтвердження',
  success: 'Успішність операції',
  profile: 'Профіль',
  'forgot-password': 'Забули пароль?',
};

const humanizePathPart = (value) => {
  try {
    return decodeURIComponent(value).replace(/-/g, ' ');
  } catch {
    return value.replace(/-/g, ' ');
  }
};

const Breadcrumb = ({ customLabels = {}, items }) => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  if (Array.isArray(items) && items.length > 0) {
    return (
      <nav className="breadcrumb" aria-label="Навігація">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span className="breadcrumb-item" key={`${item.path || item.label}-${index}`}>
              {index > 0 && <span className="breadcrumb-separator" aria-hidden="true" />}
              {item.path && !isLast ? (
                <Link to={item.path} className="breadcrumb-link">{item.label}</Link>
              ) : (
                <span className="breadcrumb-current">{item.label}</span>
              )}
            </span>
          );
        })}
      </nav>
    );
  }

  const pathnames = location.pathname.split('/').filter(Boolean);

  return (
    <nav className="breadcrumb" aria-label="Навігація">
      <Link to="/" className="breadcrumb-link">
        {customLabels['/'] || fallbackRoutes['/']}
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = customLabels[value] || fallbackRoutes[value] || humanizePathPart(value);

        return (
          <span className="breadcrumb-item" key={to}>
            <span className="breadcrumb-separator" aria-hidden="true" />
            {isLast ? (
              <span className="breadcrumb-current">{name}</span>
            ) : (
              <Link to={to} className="breadcrumb-link">{name}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
