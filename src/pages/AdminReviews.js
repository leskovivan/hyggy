import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminReviews.css';

const fallbackReviewText = 'Придбали кілька стільців BISTRUP для нашої їдальні, і вони перевершили всі очікування.';

const getProductImage = (product) => product.images?.[0] || product.image || '/images/muuto.png';

const normalizeText = (value) => String(value || '').toLowerCase();

const StarIcon = ({ filled }) => (
    <svg className="admin-review-star" viewBox="0 0 20 20" aria-hidden="true">
        <path
            d="M9.96 2.25c.05 0 .09.01.13.04.04.03.07.06.09.11l1.81 4.33.23.56.6.05 4.63.4c.05 0 .09.02.13.05.04.03.07.07.08.12.02.05.02.1 0 .15-.01.04-.03.08-.06.1l-.02.02-3.51 3.08-.45.39.13.58 1.05 4.58.01.01c.01.05.01.1-.01.14-.02.05-.05.09-.09.12-.04.03-.08.04-.13.05-.05 0-.1-.01-.14-.04l-3.97-2.42-.52-.32-.52.32-3.96 2.42c-.04.02-.09.04-.14.04-.05-.01-.09-.02-.13-.05-.04-.03-.07-.07-.09-.12-.02-.04-.02-.09-.01-.14v-.01l1.05-4.57.13-.58-.45-.39-3.51-3.08-.05-.06c-.01-.02-.02-.04-.03-.07-.01-.05-.01-.1 0-.15.02-.05.05-.09.09-.12.04-.03.08-.05.13-.05l4.63-.4.6-.05.23-.56 1.81-4.33v-.01c.02-.05.05-.08.09-.11.04-.03.09-.04.13-.04Z"
            fill={filled ? '#231f20' : 'none'}
            stroke="#231f20"
            strokeWidth="1.5"
        />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.6 5 19V8H4V6h5V5c0-.6.2-1.1.6-1.5S10.4 3 11 3h2c.6 0 1.1.2 1.5.6S15 4.4 15 5v1h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-6-2h2V5h-2v1Zm-2 11h1.8v-7H9v7Zm4.2 0H15v-7h-1.8v7Z" />
    </svg>
);

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNameAsc, setIsNameAsc] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(products => {
                const flattenedReviews = [];

                products.forEach(product => {
                    (product.reviews || []).forEach((review, index) => {
                        flattenedReviews.push({
                            ...review,
                            reviewKey: `${product.id}-${review.id ?? index}`,
                            productId: product.id,
                            productName: product.name || 'Без назви',
                            productBrand: product.brand || 'BISTRUP',
                            productImage: getProductImage(product),
                            productCategory: product.category || 'category',
                            text: review.text || review.comment || fallbackReviewText,
                            rating: Number(review.rating || 0),
                        });
                    });
                });

                setReviews(flattenedReviews);
            })
            .catch(err => console.error('Помилка завантаження відгуків:', err));
    }, []);

    const handleDeleteReview = async (productId, reviewId, reviewKey) => {
        if (!window.confirm('Видалити цей відгук?')) return;

        try {
            const productRes = await fetch(`http://localhost:3001/products/${productId}`);
            const product = await productRes.json();
            const updatedReviews = (product.reviews || []).filter(review => String(review.id) !== String(reviewId));

            const response = await fetch(`http://localhost:3001/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reviews: updatedReviews }),
            });

            if (response.ok) {
                setReviews(prevReviews => prevReviews.filter(review => review.reviewKey !== reviewKey));
            }
        } catch (error) {
            console.error('Помилка видалення відгуку:', error);
            alert('Не вдалося видалити відгук');
        }
    };

    const filteredReviews = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const list = reviews.filter(review => {
            if (!query) return true;

            return [
                review.productName,
                review.productBrand,
                review.author,
                review.text,
                review.rating,
            ].some(value => normalizeText(value).includes(query));
        });

        return list.sort((a, b) => {
            const result = a.productName.localeCompare(b.productName, 'uk');
            return isNameAsc ? result : -result;
        });
    }, [reviews, searchTerm, isNameAsc]);

    return (
        <div className="admin-reviews-page">
            <AdminToolbar
                title="Відгуки"
                count={filteredReviews.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => alert('Додавання відгуку буде доступне після вибору сценарію створення')}
                showFilterButton={false}
            />

            <div className="admin-reviews-table-wrapper">
                <table className="admin-reviews-table">
                    <thead>
                        <tr>
                            <th>
                                <button
                                    type="button"
                                    className="admin-reviews-sort"
                                    onClick={() => setIsNameAsc(prev => !prev)}
                                >
                                    Назва
                                    <svg viewBox="0 0 12 8" aria-hidden="true">
                                        <path d="M1.41.59 6 5.17 10.59.59 12 2 6 8 0 2 1.41.59Z" />
                                    </svg>
                                </button>
                            </th>
                            <th>Виробник</th>
                            <th>Рейтинг</th>
                            <th>Текст відгуку</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReviews.map(review => (
                            <tr key={review.reviewKey}>
                                <td>
                                    <div className="admin-review-product">
                                        <Link
                                            to={`/category/${review.productCategory}/${review.productId}`}
                                            className="admin-review-image-link"
                                            aria-label={`Відкрити ${review.productName}`}
                                        >
                                            <img src={review.productImage} alt="" />
                                        </Link>
                                        <Link
                                            to={`/category/${review.productCategory}/${review.productId}`}
                                            className="admin-review-product-name"
                                        >
                                            {review.productName}
                                        </Link>
                                    </div>
                                </td>
                                <td>{review.productBrand}</td>
                                <td>
                                    <div className="admin-review-rating" aria-label={`Рейтинг ${review.rating} з 5`}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <StarIcon key={star} filled={star <= review.rating} />
                                        ))}
                                    </div>
                                </td>
                                <td className="admin-review-text">{review.text}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="admin-review-delete"
                                        onClick={() => handleDeleteReview(review.productId, review.id, review.reviewKey)}
                                        aria-label="Видалити відгук"
                                    >
                                        <TrashIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!filteredReviews.length && (
                            <tr>
                                <td className="admin-reviews-empty" colSpan="5">
                                    Нічого не знайдено
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminReviews;
