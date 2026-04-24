import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import './SearchPage.css';
import FilterSidebar from '../components/FilterSidebar';

const FilterDropdown = ({ label, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="custom-dropdown" onMouseLeave={() => setIsOpen(false)}>
            <button 
                className={`dropdown-trigger ${isOpen ? 'open' : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>{label}</span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            {isOpen && <div className="dropdown-content">{children}</div>}
        </div>
    );
};

const SearchPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('products'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // --- СТАН УСІХ ФІЛЬТРІВ ---
    const [activeFilters, setActiveFilters] = useState({
        minPrice: 0,
        maxPrice: 10000,
        onlySale: false,
        brand: 'all',
        sort: 'default',
        
        selectedCategories: [],
        styles: [],
        colors: [],
        materials: [],
        
        isNew: false,
        isHit: false,
        inStock: false,
        hasDiscount: false,
        isWholesale: false
    });

    useEffect(() => {
        fetch(`http://localhost:3001/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            });
    }, []);

    const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean), [products]);
    const availableCategories = useMemo(() => [...new Set(products.map(p => p.category))].filter(Boolean), [products]);

    const toggleArrayFilter = (filterKey, itemValue) => {
        setActiveFilters(prev => {
            const currentArray = prev[filterKey] || [];
            const isAlreadySelected = currentArray.includes(itemValue);
            const newArray = isAlreadySelected
                ? currentArray.filter(item => item !== itemValue)
                : [...currentArray, itemValue];
            return { ...prev, [filterKey]: newArray };
        });
    };

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    // --- КРОК 1: ДИНАМІЧНА БАЗА ДЛЯ САЙДБАРУ ---
    // Рахує товари після пошуку, ціни та статусів (щоб цифри в сайдбарі були точними)
    const sidebarProducts = useMemo(() => {
        let result = [...products];
        
        if (query) {
            const searchWords = query.toLowerCase().trim().split(/\s+/);
            result = result.filter(p => searchWords.every(word => p.name.toLowerCase().includes(word)));
        }
        result = result.filter(p => p.price >= activeFilters.minPrice && p.price <= activeFilters.maxPrice);
        
        if (activeFilters.brand !== 'all') result = result.filter(p => p.brand === activeFilters.brand);
        if (activeFilters.onlySale) result = result.filter(p => p.oldPrice);
        if (activeFilters.isNew) result = result.filter(p => p.isNew);
        if (activeFilters.isHit) result = result.filter(p => p.isGreatDeal);
        if (activeFilters.inStock) result = result.filter(p => p.inStock);
        if (activeFilters.hasDiscount) result = result.filter(p => p.oldPrice);
        if (activeFilters.isWholesale) result = result.filter(p => p.isAlwaysLowPrice);
        
        return result;
    }, [products, query, activeFilters.minPrice, activeFilters.maxPrice, activeFilters.brand, activeFilters.onlySale, activeFilters.isNew, activeFilters.isHit, activeFilters.inStock, activeFilters.hasDiscount, activeFilters.isWholesale]);

    // --- КРОК 2: ФІНАЛЬНИЙ РЕЗУЛЬТАТ НА ЕКРАНІ ---
    // Накладаємо вибрані чекбокси (Стиль, Колір, Матеріал) на базові товари
    const filteredResults = useMemo(() => {
        let result = [...sidebarProducts];

        if (activeFilters.selectedCategories.length > 0) result = result.filter(p => activeFilters.selectedCategories.includes(p.category));
        if (activeFilters.styles.length > 0) result = result.filter(p => activeFilters.styles.includes(p.style));
        if (activeFilters.colors.length > 0) result = result.filter(p => activeFilters.colors.includes(p.color));
        if (activeFilters.materials.length > 0) result = result.filter(p => activeFilters.materials.includes(p.material));

        switch (activeFilters.sort) {
            case 'price-asc': result.sort((a, b) => a.price - b.price); break;
            case 'price-desc': result.sort((a, b) => b.price - a.price); break;
            case 'rating': result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0)); break;
            default: break;
        }
        return result;
    }, [sidebarProducts, activeFilters.selectedCategories, activeFilters.styles, activeFilters.colors, activeFilters.materials, activeFilters.sort]);

    return (
        <div className="search-page-container">
            <div className="search-tabs">
                <button className={`tab-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                    Товари ({filteredResults.length})
                </button>
                <button className={`tab-item ${activeTab === 'pages' ? 'active' : ''}`} onClick={() => setActiveTab('pages')}>
                    Сторінки (0)
                </button>
            </div>

            <h1 className="search-results-title">
                {filteredResults.length} результатів для: "{query}"
            </h1>

            <div className="filter-bar">
                <div className="filter-group">
                    <FilterDropdown label="Ціна">
                        <div className="simple-drop-list">
                            <span onClick={() => handleFilterChange('maxPrice', 500)}>До 500$</span>
                            <span onClick={() => handleFilterChange('maxPrice', 10000)}>Всі ціни</span>
                        </div>
                    </FilterDropdown>

                    <FilterDropdown label={activeFilters.selectedCategories.length > 0 ? `Категорія (${activeFilters.selectedCategories.length})` : "Категорія"}>
                        <div className="simple-drop-list">
                            {availableCategories.map(cat => (
                                <span key={cat} className={activeFilters.selectedCategories.includes(cat) ? 'active' : ''} onClick={() => toggleArrayFilter('selectedCategories', cat)}>
                                    {cat} {activeFilters.selectedCategories.includes(cat) && "✓"}
                                </span>
                            ))}
                            {activeFilters.selectedCategories.length > 0 && (
                                <button className="clear-filter-btn" onClick={() => handleFilterChange('selectedCategories', [])}>Очистити всі</button>
                            )}
                        </div>
                    </FilterDropdown>

                    <FilterDropdown label={activeFilters.brand === 'all' ? 'Торгова марка' : activeFilters.brand}>
                        <div className="simple-drop-list">
                            <span onClick={() => handleFilterChange('brand', 'all')}>Всі бренди</span>
                            {availableBrands.map(brand => (
                                <span key={brand} onClick={() => handleFilterChange('brand', brand)}>{brand}</span>
                            ))}
                        </div>
                    </FilterDropdown>

                    <FilterDropdown label="Сортувати">
                        <div className="simple-drop-list">
                            <span onClick={() => handleFilterChange('sort', 'default')}>За замовчуванням</span>
                            <span onClick={() => handleFilterChange('sort', 'price-asc')}>Найдешевші</span>
                            <span onClick={() => handleFilterChange('sort', 'price-desc')}>Найдорожчі</span>
                        </div>
                    </FilterDropdown>

                    <button className="filter-btn-all" onClick={() => setIsSidebarOpen(true)}>Всі фільтри</button>
                </div>

                <div className="sale-toggle-container">
                    <span>Товари на акції</span>
                    <label className="switch">
                        <input type="checkbox" checked={activeFilters.onlySale} onChange={(e) => handleFilterChange('onlySale', e.target.checked)} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Завантаження...</div>
            ) : (
                <div className="profile-grid">
                    {filteredResults.length > 0 ? (
                        filteredResults.map(product => <ItemCard key={product.id} product={product} />)
                    ) : (
                        <p style={{textAlign: 'center', width: '100%', fontSize: '18px', color: '#888', marginTop: '40px'}}>Товарів за такими фільтрами не знайдено.</p>
                    )}
                </div>
            )}

            {/* САЙДБАР: Тепер передаємо sidebarProducts, щоб цифри були актуальними */}
            <FilterSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                products={sidebarProducts} 
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                toggleArrayFilter={toggleArrayFilter}
            />
        </div>
    );
};

export default SearchPage;