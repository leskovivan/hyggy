import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogList.css';

const API_URL = 'http://localhost:3001/blogs';

const getKeywords = (blog) => {
    if (Array.isArray(blog.keywords)) {
        return blog.keywords.join(', ');
    }

    return blog.keywords || '—';
};

const EditIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4.4L19.8 8.6a2.1 2.1 0 0 0 0-3L18.4 4.2a2.1 2.1 0 0 0-3 0L4 15.6V20Z" />
        <path d="m14 5.6 4.4 4.4" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 7h12" />
        <path d="M9 7V5h6v2" />
        <path d="M8 10v9h8v-9" />
        <path d="M10.5 12.5v4" />
        <path d="M13.5 12.5v4" />
    </svg>
);

const AdminBlogList = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isTitleAsc, setIsTitleAsc] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setBlogs(Array.isArray(data) ? data : []))
            .catch(error => console.error('Помилка завантаження блогів:', error));
    }, []);

    const filteredBlogs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return blogs
            .filter(blog => {
                if (!query) {
                    return true;
                }

                return [
                    blog.title,
                    blog.mainCategory,
                    getKeywords(blog),
                ].filter(Boolean).join(' ').toLowerCase().includes(query);
            })
            .sort((a, b) => {
                const result = String(a.title || '').localeCompare(String(b.title || ''), 'uk', { numeric: true });
                return isTitleAsc ? result : -result;
            });
    }, [blogs, isTitleAsc, searchTerm]);

    const handleDelete = async (id) => {
        if (!window.confirm('Видалити цей блог?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error('Не вдалося видалити блог');
            }

            setBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== id));
        } catch (error) {
            console.error('Помилка видалення блогу:', error);
            alert('Не вдалося видалити блог');
        }
    };

    return (
        <section className="admin-blog-list-page">
            <AdminToolbar
                title="Блоги"
                count={filteredBlogs.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => navigate('/admin/blogs/new')}
                showFilterButton={false}
            />

            <div className="admin-blogs-table-wrapper">
                <table className="admin-blogs-table">
                    <thead>
                        <tr>
                            <th>
                                <button
                                    type="button"
                                    className="admin-blogs-sort"
                                    onClick={() => setIsTitleAsc(current => !current)}
                                >
                                    Заголовок блогу <span aria-hidden="true">{isTitleAsc ? '⌄' : '⌃'}</span>
                                </button>
                            </th>
                            <th>Категорія</th>
                            <th>Ключові слова</th>
                            <th aria-label="Дії"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBlogs.map(blog => (
                            <tr key={blog.id}>
                                <td>
                                    <div className="admin-blog-main-info">
                                        <img
                                            src={blog.coverImage}
                                            alt=""
                                            className="admin-blog-thumb"
                                            loading="lazy"
                                        />
                                        <span>{blog.title || '—'}</span>
                                    </div>
                                </td>
                                <td>{blog.mainCategory || '—'}</td>
                                <td>{getKeywords(blog)}</td>
                                <td>
                                    <div className="admin-blog-actions">
                                        <button
                                            type="button"
                                            className="admin-blog-action"
                                            onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                                            aria-label={`Редагувати блог ${blog.title || ''}`}
                                        >
                                            <EditIcon />
                                        </button>
                                        <button
                                            type="button"
                                            className="admin-blog-action admin-blog-action-danger"
                                            onClick={() => handleDelete(blog.id)}
                                            aria-label={`Видалити блог ${blog.title || ''}`}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {filteredBlogs.length === 0 && (
                            <tr>
                                <td className="admin-blogs-empty" colSpan="4">Блоги не знайдено</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminBlogList;
