import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import ItemCard from '../components/ItemCard';
import FilterSidebar from '../components/FilterSidebar';
import { products as localProducts } from './products';
import './SearchPage.css';

const PRODUCTS_URL = 'http://localhost:3001/products';
const BLOGS_URL = 'http://localhost:3001/blogs';

const productOverrides = {
  1: { brand: 'BISTRUP', name: 'Стілець обідній BISTRUP оливковий/дуб', image: '/images/product-chair.png' },
  2: { brand: 'JULIUS', name: 'Лампа настільна JULIUS д.19см натуральний', image: '/images/office.png' },
  3: { brand: 'VEJLBY', name: 'Софа-ліжко VEJLBY з шезлонгом світло-пісочний', image: '/images/bedroom.png' },
  4: { brand: 'NORDVIKEN', name: 'Барний стілець NORDVIKEN чорний', image: '/images/kitchen.png' },
  5: { brand: 'FORHOJA', name: 'Кухонний візок FORHOJA масив берези', image: '/images/Garden.png' },
  6: { brand: 'HAVBERG', name: 'Крісло для відпочинку HAVBERG темно-сіре', image: '/images/office.png' },
  7: { brand: 'TARVA', name: 'Ліжко двоспальне TARVA 160x200 сосна', image: '/images/bedroom.png' },
  8: { brand: 'BESTA', name: 'Тумба під телевізор BESTA чорно-коричнева', image: '/images/muuto.png' },
  9: { brand: 'LERSTA', name: 'Торшер для читання LERSTA алюміній', image: '/images/office.png' },
  10: { brand: 'LAGKAPTEN', name: 'Письмовий стіл LAGKAPTEN білий', image: '/images/kitchen.png' },
};

const staticPages = [
  {
    id: 'catalog',
    title: 'Каталог товарів',
    description: 'Усі категорії меблів, декору та товарів для дому.',
    url: '/category',
    type: 'Сторінка',
    image: '/images/kitchen.png',
    keywords: ['каталог', 'товари', 'категорії', 'меблі'],
  },
  {
    id: 'blog',
    title: 'Блог',
    description: 'Ідеї для дому, саду, сну та догляду за меблями.',
    url: '/blog',
    type: 'Сторінка',
    image: '/images/blog-categories/home-living.png',
    keywords: ['блог', 'статті', 'поради', 'інтер’єр'],
  },
  {
    id: 'shops',
    title: 'Магазини',
    description: 'Пошук найближчого магазину HYGGY і графіки роботи.',
    url: '/shops',
    type: 'Сторінка',
    image: '/images/shops/shop-interior.png',
    keywords: ['магазини', 'адреса', 'графік', 'локація'],
  },
  {
    id: 'qa',
    title: 'Питання-відповідь',
    description: 'Відповіді щодо замовлень, доставки, оплати та сервісу.',
    url: '/qa',
    type: 'Сторінка',
    image: '/images/blog-categories/home-office.png',
    keywords: ['питання', 'відповідь', 'доставка', 'замовлення'],
  },
  {
    id: 'work',
    title: 'Робота',
    description: 'Вакансії та інформація про роботу в HYGGY.',
    url: '/work',
    type: 'Сторінка',
    image: '/images/work/work-hero.png',
    keywords: ['робота', 'вакансії', 'кар’єра'],
  },
  {
    id: 'about',
    title: 'Про нас',
    description: 'Історія, цінності та підхід HYGGY до облаштування дому.',
    url: '/about',
    type: 'Сторінка',
    image: '/images/about_us.png',
    keywords: ['про нас', 'hyggy', 'компанія'],
  },
];

const fallbackBlogPages = [
  {
    id: 'wood-care',
    title: 'Секрети довговічності: як доглядати за меблями з натурального дерева',
    description: 'Прості правила догляду, які допоможуть дерев’яним меблям залишатися красивими довше.',
    url: '/blog/wood-care',
    type: 'Блог',
    image: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1200&q=80',
  },
  {
    id: 'small-flat',
    title: 'Як обрати ідеальні меблі для маленької квартири',
    description: 'Функціональні рішення для невеликих кімнат без відчуття перевантаження.',
    url: '/blog/small-flat',
    type: 'Блог',
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=80',
  },
  {
    id: 'garden-furniture',
    title: 'Як вибрати стійкі меблі для саду',
    description: 'Матеріали, які витримують погоду, сонце та щоденне використання.',
    url: '/blog/garden-furniture',
    type: 'Блог',
    image: 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=1200&q=80',
  },
  {
    id: 'modular',
    title: 'Чому варто обрати модульні меблі',
    description: 'Переваги модульних систем та ідеї використання в різних кімнатах.',
    url: '/blog/modular',
    type: 'Блог',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
  },
];

const normalizeText = (value) => String(value || '').toLowerCase().trim();

const hasMojibake = (value = '') => /(РЎ|Рђ|Рџ|Рњ|Рљ|Рќ|Р’|Р“|Р”|Рћ|Р†|СЊ|С–|С—|вЂ|Г–|Г…|Гі)/.test(String(value));

const textOrFallback = (value, fallback) => (value && !hasMojibake(value) ? value : fallback);

const categoryAliases = {
  kitchen: ['kitchen', 'dining-tables', 'dining-chairs', 'dining-sets'],
  garden: ['garden', 'garden-tables'],
  'living-room': ['living-room', 'lounge-sets'],
  decor: ['decor', 'accessories'],
};

const pickById = (id, values) => values[Math.abs(Number(id) || 0) % values.length];

const normalizeFacetArray = (value, fallback) => {
  if (Array.isArray(value) && value.length) return value;
  if (typeof value === 'string' && value.trim()) return [value.trim()];
  return fallback;
};

const matchesQuery = (query, values) => {
  const words = normalizeText(query).split(/\s+/).filter(Boolean);
  if (!words.length) return true;
  const haystack = values.filter(Boolean).map(normalizeText).join(' ');
  return words.every((word) => haystack.includes(word));
};

const normalizeProduct = (product) => {
  const override = productOverrides[product.id] || {};
  const image = override.image || product.image || product.images?.[0] || '/images/product-chair.png';
  const category = product.category || 'kitchen';
  const price = Number(product.price || 60);
  const discountPercent = Number(product.discountPercent || 0);
  const fallbackStyle = category === 'bedroom' ? 'scandinavian' : category === 'living-room' ? 'modern' : pickById(product.id, ['modern', 'scandinavian', 'classic']);
  const fallbackColor = pickById(product.id, ['black', 'white', 'beige']);
  const fallbackMaterial = pickById(product.id, ['wood', 'metal', 'fabric']);
  const fallbackDetail = product.hasDelivery === false ? 'foldable' : 'with-storage';

  return {
    ...product,
    ...override,
    brand: textOrFallback(override.brand || product.brand, 'HYGGY'),
    name: textOrFallback(override.name || product.name, product.slug?.replace(/-/g, ' ') || 'Товар HYGGY'),
    image,
    images: product.images?.length ? product.images : [image],
    category,
    filterCategories: product.filterCategories || categoryAliases[category] || [category],
    price,
    oldPrice: product.oldPrice ?? (discountPercent ? Math.round(price / (1 - discountPercent / 100)) : null),
    inStock: product.inStock !== false,
    hasDelivery: product.hasDelivery !== false,
    isNew: product.isNew ?? true,
    isHit: product.isHit ?? product.isGreatDeal ?? Number(product.rating || 0) >= 4.5,
    isWholesale: product.isWholesale ?? product.isAlwaysLowPrice ?? Number(product.price || 0) >= 150,
    details: normalizeFacetArray(product.details, [fallbackDetail]),
    styles: normalizeFacetArray(product.styles, [fallbackStyle]),
    colors: normalizeFacetArray(product.colors, [fallbackColor]),
    materials: normalizeFacetArray(product.materials, [fallbackMaterial]),
    discountPercent,
  };
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
  const [filters, setFilters] = useState({
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
      fetch(PRODUCTS_URL).then((res) => (res.ok ? res.json() : [])).catch(() => []),
      fetch(BLOGS_URL).then((res) => (res.ok ? res.json() : [])).catch(() => []),
    ])
      .then(([productsData, blogsData]) => {
        const sourceProducts = Array.isArray(productsData) && productsData.length ? productsData : localProducts;
        setProducts(sourceProducts.map(normalizeProduct));
        setBlogs(Array.isArray(blogsData) ? blogsData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, activeTab, filters]);

  const brands = useMemo(() => [...new Set(products.map((product) => product.brand))].filter(Boolean), [products]);
  const categories = useMemo(() => [...new Set(products.map((product) => product.category))].filter(Boolean), [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => matchesQuery(query, [
      product.name,
      product.brand,
      product.category,
      product.description,
    ]));

    result = result.filter((product) => Number(product.price || 0) >= filters.minPrice && Number(product.price || 0) <= filters.maxPrice);

    if (filters.brand !== 'all') result = result.filter((product) => product.brand === filters.brand);
    if (filters.selectedCategories.length) {
      result = result.filter((product) => filters.selectedCategories.some((category) => (
        product.category === category || product.filterCategories?.includes(category)
      )));
    }
    if (filters.onlySale) result = result.filter((product) => product.oldPrice || product.discountPercent);
    if (filters.isNew) result = result.filter((product) => product.isNew);
    if (filters.isHit) result = result.filter((product) => product.isHit);
    if (filters.inStock) result = result.filter((product) => product.inStock);
    if (filters.hasDiscount) result = result.filter((product) => product.oldPrice || product.discountPercent);
    if (filters.isWholesale) result = result.filter((product) => product.isWholesale);
    if (filters.details?.length) result = result.filter((product) => filters.details.some((detail) => product.details?.includes(detail)));
    if (filters.styles.length) result = result.filter((product) => filters.styles.some((style) => product.styles?.includes(style)));
    if (filters.colors.length) result = result.filter((product) => filters.colors.some((color) => product.colors?.includes(color)));
    if (filters.materials.length) result = result.filter((product) => filters.materials.some((material) => product.materials?.includes(material)));

    if (filters.sort === 'price-asc') result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    if (filters.sort === 'price-desc') result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    if (filters.sort === 'rating') result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));

    return result;
  }, [products, query, filters]);

  const pageResults = useMemo(() => {
    const blogResults = blogs.map((blog, index) => {
      const fallback = fallbackBlogPages[index % fallbackBlogPages.length];
      const textBlock = blog.content?.find((block) => block.type === 'text' && block.value)?.value;

      return {
        id: `blog-${blog.id}`,
        title: textOrFallback(blog.title, fallback.title),
        description: textOrFallback(textBlock, fallback.description),
        url: `/blog/${blog.id}`,
        type: 'Блог',
        image: blog.coverImage || blog.image || fallback.image,
        keywords: [blog.mainCategory, blog.title],
      };
    });

    const sourcePages = [...staticPages, ...fallbackBlogPages, ...blogResults];
    return sourcePages.filter((pageItem) => matchesQuery(query, [
      pageItem.title,
      pageItem.description,
      pageItem.type,
      ...(pageItem.keywords || []),
    ]));
  }, [blogs, query]);

  const pageSize = activeTab === 'products' ? 16 : 10;
  const activeResults = activeTab === 'products' ? filteredProducts : pageResults;
  const totalPages = Math.max(1, Math.ceil(activeResults.length / pageSize));
  const visibleResults = activeResults.slice((page - 1) * pageSize, page * pageSize);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
  };

  return (
    <main className="search-page">
      <div className="search-page-container">
        <Breadcrumb items={[
          { label: 'Домашня сторінка', path: '/' },
          { label: 'Результат пошуку' },
        ]} />

        <div className="search-tabs" role="tablist" aria-label="Результати пошуку">
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
          <span>{activeResults.length}</span> результатів для: {query ? query : '---'}
        </h1>

        {activeTab === 'products' && (
          <ProductFilters
            brands={brands}
            categories={categories}
            filters={filters}
            updateFilter={updateFilter}
            toggleArrayFilter={toggleArrayFilter}
            openSidebar={() => setIsSidebarOpen(true)}
          />
        )}

        {loading ? (
          <div className="loading-state">Завантаження...</div>
        ) : activeTab === 'products' ? (
          <ProductResults products={visibleResults} />
        ) : (
          <PageResults pages={visibleResults} />
        )}

        {totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}

        <FilterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          products={products}
          activeFilters={filters}
          onFilterChange={updateFilter}
          toggleArrayFilter={toggleArrayFilter}
        />
      </div>
    </main>
  );
};

const FilterDropdown = ({ label, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-dropdown" onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        className={`dropdown-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen((value) => !value)}
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

const ProductFilters = ({ brands, categories, filters, updateFilter, toggleArrayFilter, openSidebar }) => (
  <div className="filter-bar">
    <div className="filter-group">
      <FilterDropdown label="Ціна">
        <div className="simple-drop-list">
          <button type="button" onClick={() => updateFilter('maxPrice', 80)}>До 80$</button>
          <button type="button" onClick={() => updateFilter('maxPrice', 150)}>До 150$</button>
          <button type="button" onClick={() => updateFilter('maxPrice', 10000)}>Всі ціни</button>
        </div>
      </FilterDropdown>

      <FilterDropdown label={filters.selectedCategories.length ? `Категорія (${filters.selectedCategories.length})` : 'Категорія'}>
        <div className="simple-drop-list">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              className={filters.selectedCategories.includes(category) ? 'active' : ''}
              onClick={() => toggleArrayFilter('selectedCategories', category)}
            >
              {category}
            </button>
          ))}
        </div>
      </FilterDropdown>

      <FilterDropdown label={filters.brand === 'all' ? 'Торгова марка' : filters.brand}>
        <div className="simple-drop-list">
          <button type="button" onClick={() => updateFilter('brand', 'all')}>Всі бренди</button>
          {brands.map((brand) => (
            <button type="button" key={brand} onClick={() => updateFilter('brand', brand)}>{brand}</button>
          ))}
        </div>
      </FilterDropdown>

      <FilterDropdown label="Сортувати">
        <div className="simple-drop-list">
          <button type="button" onClick={() => updateFilter('sort', 'default')}>За замовчуванням</button>
          <button type="button" onClick={() => updateFilter('sort', 'price-asc')}>Найдешевші</button>
          <button type="button" onClick={() => updateFilter('sort', 'price-desc')}>Найдорожчі</button>
          <button type="button" onClick={() => updateFilter('sort', 'rating')}>За рейтингом</button>
        </div>
      </FilterDropdown>

      <button type="button" className="filter-btn-all" onClick={openSidebar}>Всі фільтри</button>
    </div>

    <label className="sale-toggle-container">
      <span>Товари на акції</span>
      <span className="switch">
        <input
          type="checkbox"
          checked={filters.onlySale}
          onChange={(event) => updateFilter('onlySale', event.target.checked)}
        />
        <span className="slider round" />
      </span>
    </label>
  </div>
);

const ProductResults = ({ products }) => {
  if (!products.length) {
    return <p className="search-empty">Товарів за таким запитом не знайдено.</p>;
  }

  return (
    <div className="search-products-grid">
      {products.map((product) => <ItemCard key={product.id} product={product} />)}
    </div>
  );
};

const PageResults = ({ pages }) => {
  if (!pages.length) {
    return <p className="search-empty">Сторінок за таким запитом не знайдено.</p>;
  }

  return (
    <div className="search-pages-layout">
      {pages.map((pageItem, index) => (
        <Link
          key={`${pageItem.id}-${index}`}
          to={pageItem.url}
          className={`search-story-card ${index % 5 === 0 ? 'search-story-card--large' : ''}`}
        >
          <img src={pageItem.image} alt="" loading="lazy" />
          <span className="search-story-card__shade" aria-hidden="true" />
          <span className="search-story-card__title">{pageItem.title}</span>
          <span className="search-story-card__description">{pageItem.description}</span>
        </Link>
      ))}
    </div>
  );
};

const Pagination = ({ page, totalPages, setPage }) => {
  const compactPages = totalPages <= 4 ? Array.from({ length: totalPages }, (_, index) => index + 1) : [1, 2, 'ellipsis', totalPages];

  return (
    <nav className="search-pagination" aria-label="Сторінки результатів">
      <button type="button" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Попередня сторінка">
        &lt;
      </button>
      {compactPages.map((item) => (
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
};

export default SearchPage;
