import React, { useState } from 'react';
import './FilterSidebar.css';

const Accordion = ({ title, children, isOpenDefault = false }) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);
    return (
        <div className={`filter-accordion ${isOpen ? 'open' : ''}`}>
            <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
                <span>{title}</span>
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                    <path d="M1 1L8 8L15 1" stroke="#231F20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>
            {isOpen && <div className="accordion-content">{children}</div>}
        </div>
    );
};

const FilterSidebar = ({ isOpen, onClose, products, activeFilters, onFilterChange, toggleArrayFilter }) => {
    if (!isOpen) return null;

    const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
    const brands = [...new Set(products.map(p => p.brand))].filter(Boolean);
    const styles = [...new Set(products.map(p => p.style))].filter(Boolean);
    const colors = [...new Set(products.map(p => p.color))].filter(Boolean);
    const materials = [...new Set(products.map(p => p.material))].filter(Boolean);

    // Допоміжна функція для малювання чекбоксів з масивів
    const renderArrayCheckboxes = (items, filterKey) => {
        if (items.length === 0) return <p style={{ color: '#888', fontSize: '14px' }}>Немає опцій</p>;
        
        return items.map(item => {
            // Магія цифр: рахуємо скільки товарів реально залишилося
            const dbField = filterKey === 'selectedCategories' ? 'category' : filterKey.slice(0, -1);
            const count = products.filter(p => p[dbField] === item).length;
            
            return (
                <label key={item} className="check-item">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>{item}</span>
                        <span style={{ color: '#a0a0a0', fontSize: '14px' }}>{count}</span>
                    </div>
                    <input 
                        type="checkbox" 
                        checked={activeFilters[filterKey].includes(item)}
                        onChange={() => toggleArrayFilter(filterKey, item)}
                    />
                    <span className="checkmark"></span>
                </label>
            );
        });
    };

    return (
        <div className="filter-sidebar-overlay" onClick={onClose}>
            <div className="filter-sidebar-content" onClick={e => e.stopPropagation()}>
                <div className="sidebar-header">
                    <h2>Фільтри</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="sidebar-body">
                    {/* ТУМБЛЕР */}
                    <div className="sidebar-row toggle-row">
                        <span>Товари на акції</span>
                        <label className="switch">
                            <input 
                                type="checkbox" 
                                checked={activeFilters.onlySale}
                                onChange={(e) => onFilterChange('onlySale', e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>

                    <div className="divider"></div>

                    {/* ЦІНА */}
                    <Accordion title="Ціна" isOpenDefault={true}>
                        <div className="price-range-container">
                            <div className="dual-range-wrapper">
                                <div 
                                    className="range-track" 
                                    style={{
                                        left: `${(activeFilters.minPrice / 10000) * 100}%`,
                                        right: `${100 - (activeFilters.maxPrice / 10000) * 100}%`
                                    }}
                                ></div>
                                <input 
                                    type="range" min="0" max="10000" step="10"
                                    value={activeFilters.minPrice}
                                    onChange={(e) => onFilterChange('minPrice', Math.min(Number(e.target.value), activeFilters.maxPrice - 100))}
                                    className="thumb thumb--left"
                                />
                                <input 
                                    type="range" min="0" max="10000" step="10"
                                    value={activeFilters.maxPrice}
                                    onChange={(e) => onFilterChange('maxPrice', Math.max(Number(e.target.value), activeFilters.minPrice + 100))}
                                    className="thumb thumb--right"
                                />
                            </div>
                            <div className="price-inputs">
                                <div className="input-field">
                                    <span className="field-label">Мін</span>
                                    <input type="number" value={activeFilters.minPrice} onChange={(e) => onFilterChange('minPrice', Number(e.target.value))} />
                                </div>
                                <div className="input-field">
                                    <span className="field-label">Макс</span>
                                    <input type="number" value={activeFilters.maxPrice} onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </Accordion>

                    {/* КАТЕГОРІЇ */}
                    <Accordion title="Категорії">
                        <div className="checkbox-list">
                            {renderArrayCheckboxes(categories, 'selectedCategories')}
                        </div>
                    </Accordion>

                    {/* ТОРГОВА МАРКА */}
                    <Accordion title="Торгова марка">
                        <div className="checkbox-list">
                            {brands.map(brand => (
                                <label key={brand} className="check-item">
                                    <span>{brand}</span>
                                    <input 
                                        type="checkbox" 
                                        checked={activeFilters.brand === brand}
                                        onChange={() => onFilterChange('brand', activeFilters.brand === brand ? 'all' : brand)}
                                    />
                                    <span className="checkmark"></span>
                                </label>
                            ))}
                        </div>
                    </Accordion>

                    {/* СТАТУС */}
                    <Accordion title="Статус">
                        <div className="checkbox-list">
                            <label className="check-item">
                                <span>Новинка</span>
                                <input 
                                    type="checkbox" 
                                    checked={activeFilters.isNew} 
                                    onChange={(e) => onFilterChange('isNew', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                            </label>
                            <label className="check-item">
                                <span>Хіт продажу</span>
                                <input 
                                    type="checkbox" 
                                    checked={activeFilters.isHit} 
                                    onChange={(e) => onFilterChange('isHit', e.target.checked)}
                                />
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </Accordion>

                    {/* ДОСТАВКА */}
                    <Accordion title="Доставка">
                        <div className="status-buttons">
                            <button 
                                className={`status-tag ${activeFilters.inStock ? 'active' : ''}`}
                                onClick={() => onFilterChange('inStock', !activeFilters.inStock)}
                            >В наявності</button>
                            <button 
                                className={`status-tag ${activeFilters.hasDiscount ? 'active' : ''}`} 
                                onClick={() => onFilterChange('hasDiscount', !activeFilters.hasDiscount)}
                            >Знижка</button>
                            <button 
                                className={`status-tag ${activeFilters.isWholesale ? 'active' : ''}`} 
                                onClick={() => onFilterChange('isWholesale', !activeFilters.isWholesale)}
                            >Оптова ціна</button>
                        </div>
                    </Accordion>

                    {/* СТИЛЬ */}
                    <Accordion title="Стиль">
                        <div className="checkbox-list">
                            {renderArrayCheckboxes(styles, 'styles')}
                        </div>
                    </Accordion>

                    {/* КОЛІР */}
                    <Accordion title="Колір">
                        <div className="checkbox-list">
                            {renderArrayCheckboxes(colors, 'colors')}
                        </div>
                    </Accordion>

                    {/* МАТЕРІАЛ */}
                    <Accordion title="Матеріал">
                        <div className="checkbox-list">
                            {renderArrayCheckboxes(materials, 'materials')}
                        </div>
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;