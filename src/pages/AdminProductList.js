import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminProductList.css';
import AdminToolbar from '../components/AdminToolbar';

const categoryLabels = {
    kitchen: 'Кухня',
    bedroom: 'Спальня',
    bathroom: 'Ванна',
    office: 'Офіс',
    garden: 'Сад',
    'living-room': 'Вітальня',
};

const getCategoryLabel = (category) => categoryLabels[category] || category || 'Без категорії';
const getWarehouse = (product) => product.warehouse || product.storehouse || 'Загальний склад';

const StarIcon = ({ filled }) => (
    <svg className="product-star" viewBox="0 0 20 20" aria-hidden="true">
        <path
            d="M9.96 2.25c.05 0 .09.01.13.04.04.03.07.06.09.11l1.81 4.33.23.56.6.05 4.63.4c.05 0 .09.02.13.05.04.03.07.07.08.12.02.05.02.1 0 .15-.01.04-.03.08-.06.1l-.02.02-3.51 3.08-.45.39.13.58 1.05 4.58.01.01c.01.05.01.1-.01.14-.02.05-.05.09-.09.12-.04.03-.08.04-.13.05-.05 0-.1-.01-.14-.04l-3.97-2.42-.52-.32-.52.32-3.96 2.42c-.04.02-.09.04-.14.04-.05-.01-.09-.02-.13-.05-.04-.03-.07-.07-.09-.12-.02-.04-.02-.09-.01-.14v-.01l1.05-4.57.13-.58-.45-.39-3.51-3.08-.05-.06c-.01-.02-.02-.04-.03-.07-.01-.05-.01-.1 0-.15.02-.05.05-.09.09-.12.04-.03.08-.05.13-.05l4.63-.4.6-.05.23-.56 1.81-4.33v-.01c.02-.05.05-.08.09-.11.04-.03.09-.04.13-.04Z"
            fill={filled ? '#231f20' : 'none'}
            stroke="#231f20"
            strokeWidth="1.5"
        />
    </svg>
);

const EditIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 17.3V20h2.7L17.9 9.8l-2.7-2.7L5 17.3Zm14.8-9.6c.3-.3.3-.8 0-1.1l-2.4-2.4a.8.8 0 0 0-1.1 0l-1.5 1.5 3.5 3.5 1.5-1.5Z" />
    </svg>
);

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.6 5 19V8H4V6h5V5c0-.6.2-1.1.6-1.5S10.4 3 11 3h2c.6 0 1.1.2 1.5.6S15 4.4 15 5v1h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-6-2h2V5h-2v1Zm-2 11h1.8v-7H9v7Zm4.2 0H15v-7h-1.8v7Z" />
    </svg>
);

const DeliveryIcon = ({ available }) => (
    <span className={available ? 'delivery-status delivery-status--yes' : 'delivery-status delivery-status--no'}>
        {available ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9.2 16.6 4.9 12.3l-1.4 1.4 5.7 5.7L21 7.6l-1.4-1.4L9.2 16.6Z" />
            </svg>
        ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="m6.4 5 12.6 12.6-1.4 1.4L5 6.4 6.4 5Z" />
                <path d="M17.6 5 5 17.6 6.4 19 19 6.4 17.6 5Z" />
            </svg>
        )}
    </span>
);

const AdminProductList = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Помилка завантаження:', err));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm('Видалити цей товар?')) {
            fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' })
                .then(res => {
                    if (res.ok) setProducts(prev => prev.filter(product => product.id !== id));
                    else alert('Не вдалося видалити.');
                })
                .catch(err => console.error(err));
        }
    };

    const categoryOptions = useMemo(() => {
        return [...new Set(products.map(product => product.category).filter(Boolean))]
            .map(category => ({ value: category, label: getCategoryLabel(category) }));
    }, [products]);

    const warehouseOptions = useMemo(() => {
        return [...new Set(products.map(getWarehouse).filter(Boolean))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return products.filter(product => {
            const warehouse = getWarehouse(product);
            const categoryLabel = getCategoryLabel(product.category);
            const searchFields = [
                product.id,
                product.article,
                product.name,
                product.brand,
                product.price,
                categoryLabel,
                warehouse,
            ].filter(Boolean).join(' ').toLowerCase();

            const matchesSearch = query ? searchFields.includes(query) : true;
            const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
            const matchesWarehouse = selectedWarehouse ? warehouse === selectedWarehouse : true;

            return matchesSearch && matchesCategory && matchesWarehouse;
        });
    }, [products, searchTerm, selectedCategory, selectedWarehouse]);

    return (
        <div className="admin-product-list-container">
            <AdminToolbar
                title="Товари"
                count={filteredProducts.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => navigate('/admin/products/new')}
                filters={[
                    {
                        key: 'warehouse',
                        label: 'Склад',
                        value: selectedWarehouse,
                        onChange: setSelectedWarehouse,
                        options: warehouseOptions,
                    },
                    {
                        key: 'category',
                        label: 'Категорія',
                        value: selectedCategory,
                        onChange: setSelectedCategory,
                        options: categoryOptions,
                    },
                ]}
            />

            <div className="admin-product-table-wrapper">
                <table className="admin-product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>
                                <span className="product-sort-heading">
                                    Назва
                                    <svg viewBox="0 0 12 8" aria-hidden="true">
                                        <path d="M1.41.59 6 5.17 10.59.59 12 2 6 8 0 2 1.41.59Z" />
                                    </svg>
                                </span>
                            </th>
                            <th>Виробник</th>
                            <th>Ціна</th>
                            <th>Рейтинг</th>
                            <th>Доставка</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => {
                            const rating = Math.max(0, Math.min(5, Math.round(Number(product.rating) || 0)));
                            const hasDelivery = product.hasDelivery ?? product.delivery ?? true;

                            return (
                                <tr key={product.id}>
                                    <td>{index + 1}</td>
                                    <td className="product-name-cell">{product.name}</td>
                                    <td>{product.brand || 'BISTRUP'}</td>
                                    <td>{product.price}₴</td>
                                    <td>
                                        <div className="product-rating-stars" aria-label={`Рейтинг ${rating} з 5`}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <StarIcon key={star} filled={star <= rating} />
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <DeliveryIcon available={Boolean(hasDelivery)} />
                                    </td>
                                    <td>
                                        <div className="admin-product-row-actions">
                                            <button
                                                type="button"
                                                className="admin-product-icon-btn"
                                                aria-label="Редагувати товар"
                                                onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                                            >
                                                <EditIcon />
                                            </button>
                                            <button
                                                type="button"
                                                className="admin-product-icon-btn admin-product-icon-btn--danger"
                                                aria-label="Видалити товар"
                                                onClick={() => handleDelete(product.id)}
                                            >
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <tr>
                                <td className="admin-product-empty" colSpan="7">
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

export default AdminProductList;
