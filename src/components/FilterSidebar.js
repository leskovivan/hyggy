import React, { useMemo, useState } from 'react';
import './FilterSidebar.css';

const MAX_PRICE = 100000;

const categoryLabels = {
  kitchen: 'Кухня та їдальня',
  bedroom: 'Спальня',
  'living-room': 'Вітальня',
  office: 'Офіс',
  bathroom: 'Ванна',
  garden: 'Для саду',
  decor: 'Декор',
};

const fallbackCategories = [
  { value: 'garden-tables', label: 'Столи садові', matches: ['garden', 'garden-tables'] },
  { value: 'dining-tables', label: 'Обідні столи', matches: ['kitchen', 'dining-tables'] },
  { value: 'decor', label: 'Декор' },
  { value: 'dining-chairs', label: 'Обідні стільці', matches: ['kitchen', 'dining-chairs'] },
  { value: 'lounge-sets', label: 'Лаунж сети', matches: ['living-room', 'lounge-sets'] },
  { value: 'accessories', label: 'Аксесуари', matches: ['decor', 'accessories'] },
  { value: 'dining-sets', label: 'Обідні набори', matches: ['kitchen', 'dining-sets'] },
];

const displayLabel = (value) => categoryLabels[value] || value;

const uniqueOptions = (products, key, fallback = []) => {
  const map = new Map(fallback.map((item) => [item.value, item]));

  products.forEach((product) => {
    const value = product[key];
    if (value && !map.has(value)) {
      map.set(value, { value, label: displayLabel(value) });
    }
  });

  return Array.from(map.values());
};

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={`filter-accordion ${isOpen ? 'open' : ''}`}>
      <button type="button" className="accordion-header" onClick={() => setIsOpen((value) => !value)}>
        <span>{title}</span>
        <span className="accordion-chevron" aria-hidden="true" />
      </button>
      {isOpen && <div className="accordion-content">{children}</div>}
    </section>
  );
};

const PriceRange = ({ minPrice, maxPrice, onChange }) => {
  const safeMin = Math.min(Number(minPrice) || 0, MAX_PRICE);
  const safeMax = Math.max(Number(maxPrice) || MAX_PRICE, 0);
  const from = Math.min(safeMin, safeMax);
  const to = Math.max(safeMin, safeMax);
  const left = (from / MAX_PRICE) * 100;
  const right = 100 - (to / MAX_PRICE) * 100;

  const setMin = (value) => {
    const next = Math.min(Math.max(Number(value) || 0, 0), to);
    onChange('minPrice', next);
  };

  const setMax = (value) => {
    const next = Math.max(Math.min(Number(value) || MAX_PRICE, MAX_PRICE), from);
    onChange('maxPrice', next);
  };

  return (
    <div className="price-filter">
      <div className="dual-range" style={{ '--range-left': `${left}%`, '--range-right': `${right}%` }}>
        <input
          aria-label="Мінімальна ціна"
          type="range"
          min="0"
          max={MAX_PRICE}
          step="50"
          value={from}
          onChange={(event) => setMin(event.target.value)}
        />
        <input
          aria-label="Максимальна ціна"
          type="range"
          min="0"
          max={MAX_PRICE}
          step="50"
          value={to}
          onChange={(event) => setMax(event.target.value)}
        />
      </div>

      <div className="price-inputs">
        <label className="price-field">
          <span>Мін</span>
          <input type="number" min="0" max={MAX_PRICE} value={from} onChange={(event) => setMin(event.target.value)} />
        </label>
        <label className="price-field">
          <span>Макс</span>
          <input type="number" min="0" max={MAX_PRICE} value={to} onChange={(event) => setMax(event.target.value)} />
        </label>
      </div>
    </div>
  );
};

const CheckboxList = ({ options, selectedValues, onToggle, getCount }) => {
  if (!options.length) {
    return <p className="filter-empty">Немає опцій</p>;
  }

  return (
    <div className="checkbox-list">
      {options.map((option) => (
        <label key={option.value} className="check-item">
          <span className="check-title">{option.label}</span>
          <span className="check-count">{getCount(option.value)}</span>
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => onToggle(option.value)}
          />
          <span className="checkmark" />
        </label>
      ))}
    </div>
  );
};

const FilterChip = ({ active, children, onClick }) => (
  <button type="button" className={`filter-chip ${active ? 'active' : ''}`} onClick={onClick}>
    {children}
  </button>
);

const FilterSidebar = ({ isOpen, onClose, products = [], activeFilters, onFilterChange, toggleArrayFilter }) => {
  const categories = useMemo(() => uniqueOptions(products, 'category', fallbackCategories), [products]);
  const brands = useMemo(() => uniqueOptions(products, 'brand'), [products]);

  if (!isOpen) return null;

  const getCategoryCount = (value) => {
    const option = categories.find((item) => item.value === value);
    const matches = option?.matches || [value];
    return products.filter((product) => matches.includes(product.category) || product.filterCategories?.some((category) => matches.includes(category))).length;
  };
  const getBrandCount = (value) => products.filter((product) => product.brand === value).length;

  return (
    <div className="filter-sidebar-overlay" onClick={onClose}>
      <aside className="filter-sidebar-content" onClick={(event) => event.stopPropagation()} aria-label="Усі фільтри">
        <div className="sidebar-header">
          <h2>Фільтри</h2>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Закрити фільтри">
            ×
          </button>
        </div>

        <div className="sidebar-body">
          <label className="sidebar-row toggle-row">
            <span>Товари на акції</span>
            <span className="filter-switch">
              <input
                type="checkbox"
                checked={activeFilters.onlySale}
                onChange={(event) => onFilterChange('onlySale', event.target.checked)}
              />
              <span className="filter-switch-track" />
            </span>
          </label>

          <Accordion title="Ціна" defaultOpen>
            <PriceRange
              minPrice={activeFilters.minPrice}
              maxPrice={activeFilters.maxPrice}
              onChange={onFilterChange}
            />
          </Accordion>

          <Accordion title="Категорії">
            <CheckboxList
              options={categories}
              selectedValues={activeFilters.selectedCategories || []}
              onToggle={(value) => toggleArrayFilter('selectedCategories', value)}
              getCount={getCategoryCount}
            />
          </Accordion>

          <Accordion title="Торгова марка">
            <CheckboxList
              options={brands}
              selectedValues={activeFilters.brand === 'all' ? [] : [activeFilters.brand]}
              onToggle={(value) => onFilterChange('brand', activeFilters.brand === value ? 'all' : value)}
              getCount={getBrandCount}
            />
          </Accordion>

          <Accordion title="Статус">
            <div className="checkbox-list">
              <label className="check-item check-item--simple">
                <span className="check-title">Новинка</span>
                <input type="checkbox" checked={activeFilters.isNew} onChange={(event) => onFilterChange('isNew', event.target.checked)} />
                <span className="checkmark" />
              </label>
              <label className="check-item check-item--simple">
                <span className="check-title">Хіт продажу</span>
                <input type="checkbox" checked={activeFilters.isHit} onChange={(event) => onFilterChange('isHit', event.target.checked)} />
                <span className="checkmark" />
              </label>
            </div>
          </Accordion>

          <Accordion title="Доставка" defaultOpen>
            <div className="filter-chips">
              <FilterChip active={activeFilters.inStock} onClick={() => onFilterChange('inStock', !activeFilters.inStock)}>
                В наявності
              </FilterChip>
              <FilterChip active={activeFilters.hasDiscount} onClick={() => onFilterChange('hasDiscount', !activeFilters.hasDiscount)}>
                Знижка
              </FilterChip>
              <FilterChip active={activeFilters.isWholesale} onClick={() => onFilterChange('isWholesale', !activeFilters.isWholesale)}>
                Оптова ціна
              </FilterChip>
            </div>
          </Accordion>

          <Accordion title="Деталі">
            <CheckboxList
              options={[
                { value: 'foldable', label: 'Складний' },
                { value: 'with-storage', label: 'З місцем для зберігання' },
              ]}
              selectedValues={activeFilters.details || []}
              onToggle={(value) => toggleArrayFilter('details', value)}
              getCount={() => 10}
            />
          </Accordion>

          <Accordion title="Стиль">
            <CheckboxList
              options={[
                { value: 'modern', label: 'Сучасний' },
                { value: 'scandinavian', label: 'Скандинавський' },
                { value: 'classic', label: 'Класичний' },
              ]}
              selectedValues={activeFilters.styles || []}
              onToggle={(value) => toggleArrayFilter('styles', value)}
              getCount={() => 10}
            />
          </Accordion>

          <Accordion title="Колір">
            <CheckboxList
              options={[
                { value: 'black', label: 'Чорний' },
                { value: 'white', label: 'Білий' },
                { value: 'beige', label: 'Бежевий' },
              ]}
              selectedValues={activeFilters.colors || []}
              onToggle={(value) => toggleArrayFilter('colors', value)}
              getCount={() => 10}
            />
          </Accordion>

          <Accordion title="Матеріал">
            <CheckboxList
              options={[
                { value: 'wood', label: 'Дерево' },
                { value: 'metal', label: 'Метал' },
                { value: 'fabric', label: 'Тканина' },
              ]}
              selectedValues={activeFilters.materials || []}
              onToggle={(value) => toggleArrayFilter('materials', value)}
              getCount={() => 10}
            />
          </Accordion>
        </div>
      </aside>
    </div>
  );
};

export default FilterSidebar;
