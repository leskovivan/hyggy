import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumb.css';

const routeNames = {
  '/': 'Домашня сторінка',
  '/blog': 'Блог',
  '/shops': 'Магазини',
  '/qa': 'Питання та відповіді',
  '/work': 'Робота',
  '/about': 'Про нас',
};

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (location.pathname === '/') {
    return null; // Don't show breadcrumbs on the home page
  }

  return (
    <div className="breadcrumb">
      <Link to="/" className="breadcrumb-link">
        {routeNames['/']}
      </Link>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const name = routeNames[to] || value;

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