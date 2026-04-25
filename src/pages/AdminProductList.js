import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminProductList.css';
import AdminToolbar from '../components/AdminToolbar';

const StarIcon = ({ filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9.95557 2.25C10.002 2.25 10.048 2.2637 10.0874 2.29004C10.1267 2.31637 10.1584 2.35425 10.1772 2.39941L10.1782 2.40234L11.9888 6.72754L12.2222 7.28516L12.8247 7.33789L17.4478 7.74023H17.4507C17.4975 7.74427 17.5429 7.76199 17.5806 7.79199C17.6183 7.82211 17.6473 7.86371 17.6626 7.91113C17.6778 7.95852 17.6789 8.0096 17.6655 8.05762C17.654 8.09901 17.6302 8.13427 17.6011 8.16406L17.5796 8.18359L14.0718 11.2588L13.6235 11.6523L13.7563 12.2344L14.8071 16.8125L14.8081 16.8154C14.8194 16.8641 14.8156 16.9153 14.7983 16.9619C14.7811 17.0083 14.7511 17.0479 14.7124 17.0762C14.6736 17.1045 14.6276 17.121 14.5806 17.123C14.5335 17.1251 14.4858 17.1127 14.4448 17.0879L10.4731 14.668L9.95166 14.3506L9.43115 14.668L5.46826 17.0879C5.42739 17.1126 5.38044 17.125 5.3335 17.123C5.28646 17.121 5.2405 17.1045 5.20166 17.0762C5.16285 17.0478 5.13204 17.0084 5.11475 16.9619C5.09747 16.9153 5.09469 16.8641 5.10596 16.8154V16.8125L6.15576 12.2393L6.28857 11.6572L5.84033 11.2637L2.33252 8.18457L2.32764 8.17969L2.27979 8.125C2.26678 8.10444 2.25719 8.08165 2.25049 8.05762C2.2371 8.00952 2.23813 7.95859 2.25342 7.91113C2.26877 7.86365 2.29761 7.82212 2.33545 7.79199C2.37318 7.76202 2.41843 7.74419 2.46533 7.74023H2.46729L7.09229 7.33789L7.6958 7.28516L7.92822 6.72656L9.73389 2.40137V2.39941C9.75269 2.35426 9.78444 2.31639 9.82373 2.29004C9.86307 2.26371 9.90915 2.25003 9.95557 2.25Z"
      stroke="black" strokeWidth="1.5" fill={filled ? "#00aaad" : "none"} />
  </svg>
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
            .catch(err => console.error("Помилка завантаження:", err));
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Видалити цей товар?")) {
            fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' })
                .then(res => {
                    if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
                    else alert("Не вдалося видалити.");
                })
                .catch(err => console.error(err));
        }
    };

    // Унікальні значення для фільтрів
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const warehouses = [...new Set(products.map(p => p.warehouse).filter(Boolean))];

    // Фільтрація
    const filteredProducts = products.filter(p => {
        const query = searchTerm.toLowerCase();
        const matchesSearch = 
            p.name.toLowerCase().includes(query) || 
            p.id.toString().toLowerCase().includes(query);
        const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
        const matchesWarehouse = selectedWarehouse ? p.warehouse === selectedWarehouse : true;
        return matchesSearch && matchesCategory && matchesWarehouse;
    });

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
                        key: 'category',
                        label: 'Категорія',
                        value: selectedCategory,
                        onChange: setSelectedCategory,
                        options: categories,
                    },
                    {
                        key: 'warehouse',
                        label: 'Фільтр',
                        value: selectedWarehouse,
                        onChange: setSelectedWarehouse,
                        options: warehouses,
                    },
                ]}
            />

            <div className="admin-product-table-wrapper">
                <table className="admin-product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>
                                Назва
                                <span className="sort-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8">
                                        <path fill="#231F20" fillOpacity="0.5" d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z"/>
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
                        {filteredProducts.map((p, index) => (
                            <tr key={p.id}>
                                <td>{index + 1}</td>
                                <td className="product-name-cell">{p.name}</td>
                                <td>{p.brand || 'BISTRUP'}</td>
                                <td>{p.price}₴</td>
                                <td>
                                    <div className="stars-row">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <StarIcon key={i} filled={i <= Math.round(p.rating || 5)} />
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    {p.hasDelivery !== false ? (
                                        <span className="delivery-icon">
                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25ZM11.1963 18.2324L19.7895 8.16962L18.2709 6.87415L10.4578 15.2443L6.08271 11.5975L4.7998 13.1362L9.95763 17.4344L10.4357 17.8327L10.9329 17.4431L11.1963 18.2324Z" fill="#00AAAD"/>
                                            </svg>
                                        </span>
                                    ) : (
                                        <span className="delivery-icon-not">
                                            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.5 25C19.4036 25 25 19.4036 25 12.5C25 5.59644 19.4036 0 12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.4036 5.59644 25 12.5 25Z" fill="#E74C3C"/>
                                                <path d="M16 9L9 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                                <path d="M9 9L16 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                            </svg>
                                        </span>
                                    )}
                                </td>
                                <td className="admin-product-table-actions">
                                    <div className="action-dots" title="Дії" onClick={() => navigate(`/admin/products/edit/${p.id}`)}>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredProducts.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#aaa' }}>
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