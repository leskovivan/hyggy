import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ItemCard from '../components/ItemCard';
import FilterSidebar from '../components/FilterSidebar';
import './SearchPage.css';

const STATIC_PAGE_RESULTS = [
  {
    id: 'catalog',
    title: 'Каталог товарів',
    description: 'Усі категорії меблів, декору та товарів для дому.',
    url: '/category',
    type: 'Сторінка',
    keywords: ['каталог', 'товари', 'категорії', 'меблі'],
  },
  {
    id: 'blog',
    title: 'Блог',
    description: 'Ідеї для дому, саду, сну та догляду за меблями.',
    url: '/blog',
    type: 'Сторінка',
    keywords: ['блог', 'ідеї', 'статті', 'поради'],
  },
  {
    id: 'shops',
    title: 'Магазини',
    description: 'Пошук найближчого магазину HYGGY і графіки роботи.',
    url: '/shops',
    type: 'Сторінка',
    keywords: ['магазини', 'адреса', 'графік', 'локація'],
  },
  {
    id: 'qa',
    title: 'Питання-відповідь',
    description: 'Відповіді на популярні питання щодо замовлень, доставки та сервісу.',
    url: '/qa',
    type: 'Сторінка',
    keywords: ['питання', 'відповідь', 'доставка', 'замовлення'],
  },
  {
    id: 'work',
    title: 'Робота',
    description: 'Вакансії та інформація про роботу в HYGGY.',
    url: '/work',
    type: 'Сторінка',
    keywords: ['робота', 'вакансії', 'кар’єра'],
  },
  {
    id: 'about',
    title: 'Про нас',
    description: 'Історія, цінності та підхід HYGGY до облаштування дому.',
    url: '/about',
    type: 'Сторінка',
    keywords: ['про нас', 'hyggy', 'компанія'],
  },
];

const normalize = value => String(value || '').toLowerCase().trim();

const matchesQuery = (query, values) => {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = values.filter(Boolean).map(normalize).join(' ');
  return words.every(word => haystack.includes(word));
};

const FilterDropdown = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-dropdown" onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{label}</span>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
          <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);

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
    isWholesale: false,
  });

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3001/products').then(res => (res.ok ? res.json() : [])),
      fetch('http://localhost:3001/blogs').then(res => (res.ok ? res.json() : [])),
    ])
      .then(([productsData, blogsData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
      })
      .catch(() => {
        setProducts([]);
        setBlogs([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, activeTab]);

  const availableBrands = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean), [products]);
  const availableCategories = useMemo(() => [...new Set(products.map(p => p.category))].filter(Boolean), [products]);

  const toggleArrayFilter = (filterKey, itemValue) => {
    setActiveFilters(prev => {
      const currentArray = prev[filterKey] || [];
      const isAlreadySelected = currentArray.includes(itemValue);
      return {
        ...prev,
        [filterKey]: isAlreadySelected
          ? currentArray.filter(item => item !== itemValue)
          : [...currentArray, itemValue],
      };
    });
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters(prev => ({ ...prev, [key]: value }));
  };

  const sidebarProducts = useMemo(() => {
    let result = [...products];

    result = result.filter(product => matchesQuery(query, [
      product.name,
      product.category,
      product.brand,
      product.description,
    ]));

    result = result.filter(product => Number(product.price || 0) >= activeFilters.minPrice && Number(product.price || 0) <= activeFilters.maxPrice);

    if (activeFilters.brand !== 'all') result = result.filter(product => product.brand === activeFilters.brand);
    if (activeFilters.onlySale) result = result.filter(product => product.oldPrice);
    if (activeFilters.isNew) result = result.filter(product => product.isNew);
    if (activeFilters.isHit) result = result.filter(product => product.isGreatDeal);
    if (activeFilters.inStock) result = result.filter(product => product.inStock);
    if (activeFilters.hasDiscount) result = result.filter(product => product.oldPrice);
    if (activeFilters.isWholesale) result = result.filter(product => product.isAlwaysLowPrice);

    return result;
  }, [products, query, activeFilters]);

  const filteredProducts = useMemo(() => {
    let result = [...sidebarProducts];

    if (activeFilters.selectedCategories.length > 0) result = result.filter(product => activeFilters.selectedCategories.includes(product.category));
    if (activeFilters.styles.length > 0) result = result.filter(product => activeFilters.styles.includes(product.style));
    if (activeFilters.colors.length > 0) result = result.filter(product => activeFilters.colors.includes(product.color));
    if (activeFilters.materials.length > 0) result = result.filter(product => activeFilters.materials.includes(product.material));

    switch (activeFilters.sort) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.reviews?.length || 0) - (a.reviews?.length || 0));
        break;
      default:
        break;
    }

    return result;
  }, [sidebarProducts, activeFilters]);

  const pageResults = useMemo(() => {
    const blogResults = blogs
      .filter(blog => matchesQuery(query, [
        blog.title,
        blog.mainCategory,
        ...(blog.keywords || []),
        ...(blog.content || []).map(block => block.value).filter(Boolean),
      ]))
      .map(blog => ({
        id: `blog-${blog.id}`,
        title: blog.title,
        description: blog.content?.find(block => block.type === 'text' && block.value)?.value || 'Стаття блогу HYGGY',
        url: `/blog/${blog.id}`,
        type: 'Блог',
        image: blog.coverImage,
      }));

    const staticResults = STATIC_PAGE_RESULTS
      .filter(pageItem => matchesQuery(query, [pageItem.title, pageItem.description, ...(pageItem.keywords || [])]));

    return [...staticResults, ...blogResults];
  }, [blogs, query]);

  const pageSize = activeTab === 'pages' ? 8 : 12;
  const activeResultsCount = activeTab === 'pages' ? pageResults.length : filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(activeResultsCount / pageSize));
  const visibleProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const visiblePages = pageResults.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className="search-page">
      <div className="search-page-container">
        <nav className="search-breadcrumb" aria-label="Навігація">
          <Link to="/">Домашня сторінка</Link>
          <span aria-hidden="true">&gt;</span>
          <span>Результат пошуку</span>
        </nav>

        <div className="search-tabs">
          <button
            type="button"
            className={`tab-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Товари({filteredProducts.length})
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === 'pages' ? 'active' : ''}`}
            onClick={() => setActiveTab('pages')}
          >
            Сторінки({pageResults.length})
          </button>
        </div>

        <h1 className="search-results-title">
          {activeResultsCount} результатів для: {query ? `"${query}"` : '---'}
        </h1>

        {activeTab === 'products' && (
          <SearchFilters
            availableBrands={availableBrands}
            availableCategories={availableCategories}
            activeFilters={activeFilters}
            handleFilterChange={handleFilterChange}
            toggleArrayFilter={toggleArrayFilter}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}

        {loading ? (
          <div className="loading-state">Завантаження...</div>
        ) : activeTab === 'products' ? (
          <ProductResults products={visibleProducts} />
        ) : (
          <PageResults pages={visiblePages} />
        )}

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}

        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          products={sidebarProducts}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          toggleArrayFilter={toggleArrayFilter}
        />
      </div>
    </main>
  );
};

function SearchFilters({
  availableBrands,
  availableCategories,
  activeFilters,
  handleFilterChange,
  toggleArrayFilter,
  setIsSidebarOpen,
}) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <FilterDropdown label="Ціна">
          <div className="simple-drop-list">
            <button type="button" onClick={() => handleFilterChange('maxPrice', 500)}>До 500</button>
            <button type="button" onClick={() => handleFilterChange('maxPrice', 10000)}>Всі ціни</button>
          </div>
        </FilterDropdown>

        <FilterDropdown label={activeFilters.selectedCategories.length > 0 ? `Категорія (${activeFilters.selectedCategories.length})` : 'Категорія'}>
          <div className="simple-drop-list">
            {availableCategories.map(category => (
              <button
                type="button"
                key={category}
                className={activeFilters.selectedCategories.includes(category) ? 'active' : ''}
                onClick={() => toggleArrayFilter('selectedCategories', category)}
              >
                {category} {activeFilters.selectedCategories.includes(category) && '✓'}
              </button>
            ))}
            {activeFilters.selectedCategories.length > 0 && (
              <button type="button" className="clear-filter-btn" onClick={() => handleFilterChange('selectedCategories', [])}>Очистити всі</button>
            )}
          </div>
        </FilterDropdown>

        <FilterDropdown label={activeFilters.brand === 'all' ? 'Торгова марка' : activeFilters.brand}>
          <div className="simple-drop-list">
            <button type="button" onClick={() => handleFilterChange('brand', 'all')}>Всі бренди</button>
            {availableBrands.map(brand => (
              <button type="button" key={brand} onClick={() => handleFilterChange('brand', brand)}>{brand}</button>
            ))}
          </div>
        </FilterDropdown>

        <FilterDropdown label="Сортувати">
          <div className="simple-drop-list">
            <button type="button" onClick={() => handleFilterChange('sort', 'default')}>За замовчуванням</button>
            <button type="button" onClick={() => handleFilterChange('sort', 'price-asc')}>Найдешевші</button>
            <button type="button" onClick={() => handleFilterChange('sort', 'price-desc')}>Найдорожчі</button>
          </div>
        </FilterDropdown>

        <button type="button" className="filter-btn-all" onClick={() => setIsSidebarOpen(true)}>Всі фільтри</button>
      </div>

      <label className="sale-toggle-container">
        <span>Товари на акції</span>
        <span className="switch">
          <input
            type="checkbox"
            checked={activeFilters.onlySale}
            onChange={event => handleFilterChange('onlySale', event.target.checked)}
          />
          <span className="slider round" />
        </span>
      </label>
    </div>
  );
}

function ProductResults({ products }) {
  if (!products.length) {
    return <p className="search-empty">Товарів за таким запитом не знайдено.</p>;
  }

  return (
    <div className="search-products-grid">
      {products.map(product => <ItemCard key={product.id} product={product} />)}
    </div>
  );
}

function PageResults({ pages }) {
  if (!pages.length) {
    return <p className="search-empty">Сторінок за таким запитом не знайдено.</p>;
  }

  return (
    <div className="search-pages-grid">
      {pages.map(pageItem => (
        <Link key={pageItem.id} to={pageItem.url} className="search-page-card">
          {pageItem.image && (
            <span className="search-page-card__image">
              <img src={pageItem.image} alt="" loading="lazy" />
            </span>
          )}
          <span className="search-page-card__content">
            <span className="search-page-card__type">{pageItem.type}</span>
            <strong>{pageItem.title}</strong>
            <span>{pageItem.description}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function Pagination({ page, totalPages, setPage }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  const compactPages = totalPages <= 5 ? pages : [1, 2, 'ellipsis', totalPages];

  return (
    <nav className="search-pagination" aria-label="Сторінки результатів">
      <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Попередня сторінка">
        &lt;
      </button>
      {compactPages.map(item => (
        item === 'ellipsis'
          ? <span key="ellipsis">...</span>
          : (
            <button
              type="button"
              key={item}
              className={page === item ? 'active' : ''}
              onClick={() => setPage(item)}
            >
              {item}
            </button>
          )
      ))}
      <button type="button" disabled={page === totalPages} onClick={() => setPage(page + 1)} aria-label="Наступна сторінка">
        &gt;
      </button>
    </nav>
  );
}

export default SearchPage;
