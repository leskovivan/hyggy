import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom'; // ДОДАНО ІМПОРТ LINK
import './BlogPage.css';

// Тимчасові дані для іконок
const subCategories = {
  'Для дому': [
    { id: 'living-room', label: 'Вітальня', icon: '/images/blog/icon-sofa.png' },
    { id: 'kitchen', label: 'Кухня', icon: '/images/blog/icon-pot.png' },
    { id: 'bedroom', label: 'Спальня', icon: '/images/blog/icon-bed.png' },
    { id: 'bathroom', label: 'Ванна', icon: '/images/blog/icon-bath.png' },
    { id: 'office', label: 'Кабінет', icon: '/images/blog/icon-chair.png' },
    { id: 'yard', label: 'Двір', icon: '/images/blog/icon-plant.png' }
  ],
  'Для саду': [
    { id: 'balcony', label: 'Балкони та патіо', icon: '/images/blog/icon-balcony.png' },
    { id: 'outdoor', label: 'На свіжому повітрі', icon: '/images/blog/icon-outdoor.png' },
  ],
  'Для сну': [
    { id: 'mattress', label: 'Матраци', icon: '/images/blog/icon-mattress.png' },
    { id: 'pillows', label: 'Подушки', icon: '/images/blog/icon-pillow.png' },
  ]
};

const BlogPage = () => {
    const [activeTab, setActiveTab] = useState('Для дому');
    const [blogs, setBlogs] = useState([]);

    // 1. Завантажуємо статті з бази
    useEffect(() => {
        fetch('http://localhost:3001/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Помилка завантаження блогів:", err));
    }, []);

    // 2. Фільтруємо за табом і беремо ТОП-5
    const topPopularBlogs = useMemo(() => {
        return blogs
            .filter(blog => blog.mainCategory === activeTab)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 5);
    }, [blogs, activeTab]);

    return (
        <div className="blog-page-container">
            <div className="blog-header">
                <h1>Блог</h1>
                <p>Ідеї за кімнатами</p>
            </div>

            <div className="blog-main-tabs">
                {['Для дому', 'Для саду', 'Для сну'].map(tab => (
                    <button 
                        key={tab}
                        className={`blog-tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="blog-subcategories">
                {subCategories[activeTab]?.map(sub => (
                    <div key={sub.id} className="subcategory-item">
                        <div className="subcategory-icon-placeholder">
                            {/* <img src={sub.icon} alt={sub.label} /> */}
                        </div>
                        <span>{sub.label}</span>
                    </div>
                ))}
            </div>

            <h2 className="blog-section-title">{activeTab}</h2>

            {topPopularBlogs.length > 0 ? (
                <div className="blog-articles-layout">
                    {/* ВЕЛИКА КАРТКА ЛІВОРУЧ (ОБГОРНУТО В LINK) */}
                    <Link to={`/blog/${topPopularBlogs[0].id}`} className="blog-card large-card" style={{display: 'block'}}>
                        <img src={topPopularBlogs[0].coverImage} alt="Cover" />
                        <div className="blog-card-overlay">
                            <h3>{topPopularBlogs[0].title}</h3>
                        </div>
                    </Link>

                    {/* ЧОТИРИ МАЛЕНЬКІ КАРТКИ ПРАВОРУЧ (ОБГОРНУТО В LINK) */}
                    {topPopularBlogs.length > 1 && (
                        <div className="blog-small-cards-grid">
                            {topPopularBlogs.slice(1, 5).map(article => (
                                <Link key={article.id} to={`/blog/${article.id}`} className="blog-card small-card" style={{display: 'block'}}>
                                    <img src={article.coverImage} alt="Cover" />
                                    <div className="blog-card-overlay">
                                        <h3>{article.title}</h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p style={{textAlign: 'center', color: '#888'}}>У цій категорії поки немає статей.</p>
            )}
        </div>
    );
};

export default BlogPage;