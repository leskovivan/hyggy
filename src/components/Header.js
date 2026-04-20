import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import imgMenu from '../images/imgMenu.svg';
import imgCart from '../images/imgCart.svg';
import imgProf from '../images/imgProf.svg';
import imgFav from '../images/imgFav.svg';
import imgSearch from '../images/imgSearch.svg';
import imgLogo from '../images/logo.svg';
import imgLocation from '../images/imgLocation.svg';
import imgDropdown from '../images/imgDropdown.svg';
import MenuSlider from './MenuSlider';

const STORES = [
    {
        id: 1,
        title: 'HYGGY Київ, ТЦ Променада',
        statusLabel: 'Відчинено:',
        statusText: 'Зачиняється о 20:00',
    },
    {
        id: 2,
        title: 'HYGGY Київ, ТЦ Променада',
        statusLabel: 'Відчинено:',
        statusText: 'Зачиняється о 20:00',
    },
    {
        id: 3,
        title: 'HYGGY Київ, ТЦ Променада',
        statusLabel: 'Відчинено:',
        statusText: 'Зачиняється о 20:00',
    },
    {
        id: 4,
        title: 'HYGGY Київ, ТЦ Променада',
        statusLabel: 'Відчинено:',
        statusText: 'Зачиняється о 20:00',
    },
    {
        id: 5,
        title: 'HYGGY Київ, ТЦ Променада',
        statusLabel: 'Відчинено:',
        statusText: 'Зачиняється о 20:00',
    },
];

function Header() {
    const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleStoreSelector = () => {
        setIsStoreSelectorOpen((previousState) => !previousState);
    };

    const closeStoreSelector = () => {
        setIsStoreSelectorOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen((previousState) => !previousState);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

  return (
    <div className="header-wrapper">
      <div className="top-bar"></div>
      
      <div className="main-content">
        <div className="left-section">
                         <div className="logo-container">
               
                 <Link to="/"><img src={imgLogo} alt="Logo" className="logo-img" /></Link> 
             </div>
                <button className="menu-btn" onClick={toggleMenu} aria-label="Меню" aria-expanded={isMenuOpen}>
            <img src={imgMenu} alt="Menu" className="menu-icon" />
            <span>Меню</span>
        </button>
             <div className="search-section">
                <div className="search-box">
                    <input type="text" placeholder="Пошук..." className="search-input" />
                    <button className="search-icon-btn">
                        <img src={imgSearch} alt="Search" className="search-icon" />
                    </button>
                </div>
            </div>
        </div>

        <div className="right-section">
            <button className="icon-btn">
                <img src={imgFav} alt="Favorites" className="icon-img fav-icon" />
                <span>Обране</span>
            </button>
            <button className="icon-btn">
                <img src={imgProf} alt="Profile" className="icon-img prof-icon" />
                <span>Вхід</span>
            </button>
            <button className="icon-btn">
                <img src={imgCart} alt="Cart" className="icon-img cart-icon" />
                <span>Кошик</span>
            </button>
        </div>
      </div>

      <div className="bottom-nav">
        <div className='left-bottom'>
                <button className="location-selector" type="button" onClick={toggleStoreSelector}>
            <div className="location-icon-container">
                <img src={imgLocation} alt="Location" className="location-icon" />
            </div>
            <span>HYGGY Київ ТЦ Променада</span>
            <img src={imgDropdown} alt="Dropdown" className="dropdown-icon" />
        </button></div>

        <div className="nav-bottom-buttons">
        <Link to="/blog" className="nav-item">Блог</Link>
        <Link to="/shops" className="nav-item">Магазини</Link>
        <Link to="/qa" className="nav-item">Питання-відповідь</Link>
        <Link to="/work" className="nav-item">Робота</Link></div>
      </div>

            {isStoreSelectorOpen && (
                <section className="store-selector" data-node-id="2621:16935">
                    <div className="store-selector__header">
                        <p className="store-selector__header-title">HYGGY Київ ТЦ Променада</p>
                        <button type="button" className="store-selector__close" aria-label="Закрити" onClick={closeStoreSelector}>×</button>
                    </div>

                    <div className="store-selector__search-box" role="search">
                        <input className="store-selector__search-input" type="text" placeholder="Пошук..." aria-label="Пошук магазину" />
                        <button type="button" className="store-selector__search-button" aria-label="Пошук">
                            <img src={imgSearch} alt="Пошук" className="store-selector__search-icon" />
                        </button>
                    </div>

                    <div className="store-selector__list">
                        {STORES.map((store) => (
                            <article className="store-selector__card" key={store.id}>
                                <div className="store-selector__card-main">
                                    <h4 className="store-selector__card-title">{store.title}</h4>
                                    <button type="button" className="store-selector__pick-button">Обрати магазин</button>
                                </div>

                                <div className="store-selector__card-footer">
                                    <p className="store-selector__status">
                                        <span className="store-selector__status-label">{store.statusLabel}</span>{' '}
                                        <span>{store.statusText}</span>
                                    </p>
                                    <a href="#hours" className="store-selector__hours-link">Робочі години</a>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {isMenuOpen && <MenuSlider onClose={closeMenu} />}
    </div>
  );
}

export default Header;