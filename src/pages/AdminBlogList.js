import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminBlogList.css';

const AdminBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Завантаження даних із db.json
    useEffect(() => {
        fetch('http://localhost:3001/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(err => console.error("Помилка завантаження блогів:", err));
    }, []);

    // Логіка видалення
    const handleDelete = (id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цей заголовок блогу?")) {
            fetch(`http://localhost:3001/blogs/${id}`, { method: 'DELETE' })
                .then(() => setBlogs(blogs.filter(b => b.id !== id)));
        }
    };

    // Фільтрація для швидкого пошуку
    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-blog-list-container">
            {/* Верхня панель: Заголовок, лічильник та кнопка Додати */}
            <div className="admin-blog-header">
                <div className="title-area">
                    <h2>Блоги</h2>
                    <span className="blog-count">{blogs.length}</span>
                </div>
                <button className="add-blog-btn" onClick={() => navigate('/admin/blogs/new')}>
                    Додати
                </button>
            </div>

            {/* Панель пошуку */}
            <div className="admin-search-bar">
                <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        placeholder="Швидкий пошук" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Таблиця блогів */}
            <div className="admin-table-wrapper">
                <table className="admin-blogs-table">
                    <thead>
                        <tr>
                            <th className="col-title">Заголовок блогу <span className="sort-arrow">∨</span></th>
                            <th className="col-cat">Категорія</th>
                            <th className="col-tags">Ключові слова</th>
                            <th className="col-actions"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlogs.map(blog => (
                            <tr key={blog.id}>
                                <td className="blog-main-info">
                                    <img src={blog.coverImage} alt="thumb" className="blog-thumb" />
                                    <span className="blog-title-text">{blog.title}</span>
                                </td>
                                <td>{blog.mainCategory}</td>
                                <td>{blog.keywords ? blog.keywords.join(', ') : ''}</td>
                                <td className="action-buttons">
                                    <button className="edit-btn" onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}>
                                        📝
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(blog.id)}>
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminBlogList;