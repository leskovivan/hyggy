import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AdminBlogEdit.css'; // Використовуємо твої існуючі стилі адмінки

const AdminReviews = () => {
    const [reviewsList, setReviewsList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(products => {
                // Збираємо всі відгуки з усіх товарів в один масив
                const flattenedReviews = [];
                
                products.forEach(product => {
                    if (product.reviews && product.reviews.length > 0) {
                        product.reviews.forEach(review => {
                            flattenedReviews.push({
                                ...review,
                                productId: product.id,
                                productName: product.name,
                                productBrand: product.brand,
                                productImage: product.images?.[0] || product.image,
                                productCategory: product.category
                            });
                        });
                    }
                });
                
                setReviewsList(flattenedReviews);
            })
            .catch(err => console.error("Помилка завантаження відгуків:", err));
    }, []);

    const handleDeleteReview = async (productId, reviewId) => {
        if (!window.confirm("Видалити цей відгук?")) return;

        // 1. Знаходимо товар, якому належить відгук
        const productRes = await fetch(`http://localhost:3001/products/${productId}`);
        const product = await productRes.json();

        // 2. Фільтруємо масив відгуків, видаляючи потрібний
        const updatedReviews = product.reviews.filter(r => r.id !== reviewId);

        // 3. Відправляємо оновлений масив назад на сервер
        const res = await fetch(`http://localhost:3001/products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reviews: updatedReviews })
        });

        if (res.ok) {
            setReviewsList(prev => prev.filter(r => r.id !== reviewId));
        }
    };

    const filteredReviews = reviewsList.filter(r => 
        r.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-blog-edit">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 className="section-title">Відгуки <span style={{ color: '#666', fontSize: '18px' }}>{filteredReviews.length}</span></h2>
                <button className="teal-btn">Додати</button>
            </div>

            <div className="search-container" style={{ marginBottom: '20px', position: 'relative' }}>
                <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="Швидкий пошук" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ paddingLeft: '40px' }}
                />
                <span style={{ position: 'absolute', left: '15px', top: '12px', color: '#666' }}>🔍</span>
            </div>

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', fontSize: '14px', color: '#666' }}>
                        <th style={{ padding: '15px' }}>Назва</th>
                        <th>Виробник</th>
                        <th>Рейтинг</th>
                        <th>Текст відгуку</th>
                        <th style={{ padding: '15px' }}>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.map((review) => (
                        <tr key={`${review.productId}-${review.id}`} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={review.productImage} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                {/* Перехід на сторінку товару */}
                                <Link 
                                    to={`/category/${review.productCategory}/${review.productId}`} 
                                    style={{ textDecoration: 'none', color: '#000', fontWeight: '500', fontSize: '14px' }}
                                >
                                    {review.productName}
                                </Link>
                            </td>
                            <td style={{ fontSize: '14px' }}>{review.productBrand}</td>
                            <td>
                                <div style={{ display: 'flex', color: '#000' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ fontSize: '18px' }}>
                                            {i < review.rating ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td style={{ fontSize: '13px', color: '#444', maxWidth: '300px', paddingRight: '20px' }}>
                                {review.text}
                            </td>
                            <td style={{ padding: '15px' }}>
                                <button 
                                    onClick={() => handleDeleteReview(review.productId, review.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminReviews;