import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

import imgMenu from '../images/imgMenu.svg';
import imgCart from '../images/imgCart.svg';
import imgFav from '../images/imgFav.svg';
import imgSearch from '../images/imgSearch.svg';
import imgLogo from '../images/logo.svg';
import imgLocation from '../images/imgLocation.svg';
import imgDropdown from '../images/imgDropdown.svg';
import MenuSlider from './MenuSlider';
import { useAuth } from '../context/AuthContext'; 
import { useCart } from '../context/CartContext'; // Імпортуємо контекст кошика

function Header() {
    const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // --- ДАНІ З КОНТЕКСТІВ ---
    const { user } = useAuth(); 
    const { toggleCart, cartItems } = useCart(); // Дістаємо функції кошика

    // Рахуємо загальну кількість товарів у кошику
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // --- СТАН МАГАЗИНІВ ---
    const [stores, setStores] = useState([]); 
    const [selectedStore, setSelectedStore] = useState(null); 
    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        fetch('http://localhost:3001/stores')
            .then(res => res.json())
            .then(data => {
                setStores(data);
                if (data.length > 0) setSelectedStore(data[0]); 
            })
            .catch(err => console.error("Помилка завантаження магазинів:", err));
    }, []);

    const toggleStoreSelector = () => setIsStoreSelectorOpen(!isStoreSelectorOpen);
    const closeStoreSelector = () => setIsStoreSelectorOpen(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handlePickStore = (store) => {
        setSelectedStore(store);
        closeStoreSelector();
    };

    const filteredStores = stores.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div>
            <div className="header-wrapper">
                <div className="top-bar"></div>
                
                <div className="main-content">
                    <div className="left-section">
                        <div className="logo-container">
                            <Link to="/"><img src={imgLogo} alt="Logo" className="logo-img" /></Link> 
                        </div>
                        <button className="menu-btn" onClick={toggleMenu}>
                            <img src={imgMenu} alt="Menu" className="menu-icon" />
                            <span>Меню</span>
                        </button>
                        <div className="search-section">
                            <div className="search-box">
                                <input type="text" placeholder="Пошук..." className="search-input" />
                                <button className="search-icon-btn"><img src={imgSearch} alt="Search" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="right-section">
                        <Link to="/profile" className="icon-btn">
                            <img src={imgFav} alt="Favorites" />
                            <span>Обране</span>
                        </Link>
                        
                        {/* ЛОГІКА ВХОДУ / ПРОФІЛЮ */}
                        <Link to={user ? "/profile" : "/login"} className="icon-btn">
                            <img src="/images/imgProf.svg" alt="Profile" />
                            <span>{user ? user.name : 'Вхід'}</span>
                        </Link>

                        {/* КНОПКА КОШИКА (відкриває Drawer) */}
                        <button className="icon-btn" onClick={toggleCart}>
                            <div className="cart-icon-wrapper" style={{ position: 'relative', display: 'inline-flex' }}>
                                <img src={imgCart} alt="Cart" />
                                {totalItems > 0 && (
                                    <span className="cart-badge">{totalItems}</span>
                                )}
                            </div>
                            <span>Кошик</span>
                        </button>
                    </div>
                </div>

                <div className="bottom-nav-container">
                    <div className="bottom-nav">
                        <div className='left-bottom'>
                            <button className="location-selector" type="button" onClick={toggleStoreSelector}>
                                <div className="location-icon-container">
                                    <img src={imgLocation} alt="Location" className="location-icon" />
                                </div>
                                <span>{selectedStore ? selectedStore.name : 'Завантаження...'}</span>
                                <img src={imgDropdown} alt="Dropdown" className="dropdown-icon" />
                            </button>
                        </div>

                        <div className="nav-bottom-buttons">
                            <Link to="/blog" className="nav-item">Блог</Link>
                            <Link to="/shops" className="nav-item">Магазини</Link>
                            <Link to="/qa" className="nav-item">Питання-відповідь</Link>
                            <Link to="/work" className="nav-item">Робота</Link>
                        </div>
                    </div>
                </div>

                {/* СЕЛЕКТОР МАГАЗИНІВ */}
                {isStoreSelectorOpen && (
                    <section className="store-selector">
                        <div className="store-selector__header">
                            <p className="store-selector__header-title">Оберіть магазин</p>
                            <button type="button" className="store-selector__close" onClick={closeStoreSelector}>×</button>
                        </div>

                        <div className="store-selector__search-box">
                            <input 
                                className="store-selector__search-input" 
                                type="text" 
                                placeholder="Пошук міста або ТЦ..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="button" className="store-selector__search-button">
                                <img src={imgSearch} alt="Пошук" />
                            </button>
                        </div>

                        <div className="store-selector__list">
                            {filteredStores.map((store) => (
                                <article className="store-selector__card" key={store.id}>
                                    <div className="store-selector__card-main">
                                        <h4 className="store-selector__card-title">{store.name}</h4>
                                        <button 
                                            type="button" 
                                            className="store-selector__pick-button"
                                            onClick={() => handlePickStore(store)}
                                        >
                                            Обрати магазин
                                        </button>
                                    </div>

                                    <div className="store-selector__card-footer">
                                        <p className="store-selector__status">
                                            <span className="store-selector__status-label">Графік:</span>{' '}
                                            <span>Пн-Пт {store.schedule.mon.start} - {store.schedule.mon.end}</span>
                                        </p>
                                        <Link to="/shops" className="store-selector__hours-link">Детальніше</Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}

                {isMenuOpen && <MenuSlider onClose={closeMenu} />}
            </div>
        </div>
    );
}

export default Header;