import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { useCart } from '../context/CartContext';

const navItems = [
  { to: '/blog', label: 'Блог' },
  { to: '/shops', label: 'Магазини' },
  { to: '/qa', label: 'Питання-відповідь', wide: true },
  { to: '/work', label: 'Робота' },
];

const hasMojibake = (value = '') => /(РЎ|Рђ|Рџ|Рњ|Рљ|Рќ|Р’|Р“|Р”|Рћ|Р†|СЊ|С–|С—|вЂ|Г–|Г…|Гі)/.test(String(value));

const readableProduct = (product) => ({
  ...product,
  name: product.name && !hasMojibake(product.name) ? product.name : product.slug?.replace(/-/g, ' ') || 'Товар HYGGY',
  brand: product.brand && !hasMojibake(product.brand) ? product.brand : 'HYGGY',
});

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toggleCart, cartItems } = useCart();

  const [isStoreSelectorOpen, setIsStoreSelectorOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [storeSearch, setStoreSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    fetch('http://localhost:3001/stores')
      .then((res) => res.json())
      .then((data) => {
        const safeStores = Array.isArray(data) ? data : [];
        setStores(safeStores);
        setSelectedStore(safeStores[0] || null);
      })
      .catch(() => {
        setStores([]);
        setSelectedStore({ name: 'HYGGY Київ ТЦ Променада', city: 'Київ' });
      });
  }, []);

  useEffect(() => {
    const query = productSearch.trim();

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
      return undefined;
    }

    let isActive = true;

    fetch('http://localhost:3001/products')
      .then((res) => res.json())
      .then((data) => {
        if (!isActive) return;

        const words = query.toLowerCase().split(/\s+/);
        const filtered = (Array.isArray(data) ? data : []).map(readableProduct).filter((product) => {
          const haystack = `${product.name || ''} ${product.brand || ''} ${product.category || ''}`.toLowerCase();
          return words.every((word) => haystack.includes(word));
        });

        setSearchResults(filtered.slice(0, 5));
        setIsSearchDropdownOpen(true);
      })
      .catch(() => {
        if (isActive) {
          setSearchResults([]);
          setIsSearchDropdownOpen(true);
        }
      });

    return () => {
      isActive = false;
    };
  }, [productSearch]);

  const submitSearch = () => {
    const value = productSearch.trim();
    if (value.length < 2) return;

    setIsSearchDropdownOpen(false);
    setProductSearch('');
    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      submitSearch();
    }
  };

  const filteredStores = stores.filter((store) => {
    const search = storeSearch.toLowerCase();
    return (
      String(store.name || '').toLowerCase().includes(search) ||
      String(store.city || '').toLowerCase().includes(search)
    );
  });

  const storeName = selectedStore?.name && !hasMojibake(selectedStore.name)
    ? selectedStore.name
    : 'HYGGY Київ ТЦ Променада';

  return (
    <header className="header-wrapper">
      <div className="top-bar" />

      <div className="main-content">
        <div className="left-section">
          <Link to="/" className="logo-container" aria-label="HYGGY">
            <img src={imgLogo} alt="HYGGY" className="logo-img" />
          </Link>

          <button className="menu-btn" type="button" onClick={() => setIsMenuOpen(true)}>
            <img src={imgMenu} alt="" className="menu-icon" />
            <span>Меню</span>
          </button>

          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Пошук..."
                className="search-input"
                value={productSearch}
                onChange={(event) => setProductSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                onBlur={() => setTimeout(() => setIsSearchDropdownOpen(false), 180)}
                onFocus={() => productSearch.trim().length > 1 && setIsSearchDropdownOpen(true)}
              />
              <button className="search-icon-btn" type="button" onClick={submitSearch} aria-label="Пошук">
                <img src={imgSearch} alt="" />
              </button>

              {isSearchDropdownOpen && (
                <div className="search-dropdown">
                  {searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <Link
                        key={product.id}
                        to={`/category/${product.category}/${product.id}`}
                        className="search-result-item"
                        onClick={() => {
                          setProductSearch('');
                          setIsSearchDropdownOpen(false);
                        }}
                      >
                        <img src={product.image || product.images?.[0] || '/images/product-chair.png'} alt={product.name} />
                        <div className="search-result-info">
                          <p className="search-result-name">{product.name}</p>
                          <p className="search-result-price">{product.price}$</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="search-no-results">Нічого не знайдено</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="right-section">
          <Link to="/profile" className="icon-btn">
            <img src={imgFav} alt="" />
            <span>Обране</span>
          </Link>

          <Link to={user ? '/profile' : '/login'} className="icon-btn">
            <img src="/images/imgProf.svg" alt="" />
            <span>{user ? 'Профіль' : 'Вхід'}</span>
          </Link>

          <button className="icon-btn" type="button" onClick={toggleCart}>
            <span className="cart-icon-wrapper">
              <img src={imgCart} alt="" />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </span>
            <span>Кошик</span>
          </button>
        </div>
      </div>

      <div className="bottom-nav-container">
        <div className="bottom-nav">
          <button className="location-selector" type="button" onClick={() => setIsStoreSelectorOpen((value) => !value)}>
            <img src={imgLocation} alt="" className="location-icon" />
            <span>{storeName}</span>
            <img src={imgDropdown} alt="" className="dropdown-icon" />
          </button>

          <nav className="nav-bottom-buttons" aria-label="Основна навігація">
            {navItems.map((item) => (
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-item${item.wide ? ' nav-item--wide' : ''}${isActive || location.pathname.startsWith(`${item.to}/`) ? ' active' : ''}`}
                key={item.to}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {isStoreSelectorOpen && (
        <section className="store-selector">
          <div className="store-selector__header">
            <p className="store-selector__header-title">Оберіть магазин</p>
            <button type="button" className="store-selector__close" onClick={() => setIsStoreSelectorOpen(false)}>×</button>
          </div>

          <div className="store-selector__search-box">
            <input
              className="store-selector__search-input"
              type="text"
              placeholder="Пошук міста або ТЦ..."
              value={storeSearch}
              onChange={(event) => setStoreSearch(event.target.value)}
            />
            <button type="button" className="store-selector__search-button" aria-label="Пошук магазину">
              <img src={imgSearch} alt="" />
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
                    onClick={() => {
                      setSelectedStore(store);
                      setIsStoreSelectorOpen(false);
                    }}
                  >
                    Обрати магазин
                  </button>
                </div>
                <div className="store-selector__card-footer">
                  <p className="store-selector__status">
                    <span className="store-selector__status-label">Графік:</span>{' '}
                    <span>Пн-Пт {store.schedule?.mon?.start || '09:00'} - {store.schedule?.mon?.end || '19:00'}</span>
                  </p>
                  <Link to="/shops" className="store-selector__hours-link">Детальніше</Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {isMenuOpen && <MenuSlider onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
}

export default Header;
