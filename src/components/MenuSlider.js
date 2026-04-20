import React from 'react';
import './MenuSlider.css';

import imgLogo from '../images/logo.svg';

const SLIDER_ITEMS = [
  'Вітальня',
  'Кухня',
  'Спальня',
  'Ванна',
  'Кабінет',
  'Двір',
  'Вітальня',
  'Кухня',
  'Спальня',
  'Ванна',
  'Кабінет',
  'Двір',
];

function MenuSlider({ onClose }) {
  return (
    <>
      <div className="menu-slider-overlay" onClick={onClose} aria-hidden="true" />

      <aside className="menu-slider" data-node-id="1772:184" aria-label="Меню категорій">
        <div className="menu-slider__header">
          <img src={imgLogo} alt="HYGGY" className="menu-slider__logo" />
          <button
            type="button"
            className="menu-slider__close"
            aria-label="Закрити меню"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="menu-slider__line" />

        <nav className="menu-slider__list" aria-label="Категорії">
          {SLIDER_ITEMS.map((item, index) => (
            <button type="button" key={`${item}-${index}`} className="menu-slider__item">
              {item}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default MenuSlider;
