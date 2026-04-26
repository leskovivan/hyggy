import React, { useState, useEffect, useMemo } from 'react';
import './AdminOrders.css';

const categoryLabels = {
    kitchen: 'Кухня',
    bedroom: 'Спальня',
    bathroom: 'Ванна',
    office: 'Офіс',
    garden: 'Для саду',
    'living-room': 'Вітальня',
};

const formatMoney = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return '—';
    return `${Math.round(number * 100) / 100}₴`;
};

const resolveCategory = (order, item) => {
    const rawCategory = item.categoryName || item.category || order.category || '—';
    return categoryLabels[rawCategory] || rawCategory;
};

const resolveWarehouse = (order, item) => {
    return item.warehouse || order.warehouse || order.store || 'Загальний склад';
};

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/orders')
            .then(res => res.json())
            .then(data => {
                const safeOrders = Array.isArray(data) ? data : [];
                setOrders([...safeOrders].reverse());
                setLoading(false);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    const orderRows = useMemo(() => {
        return orders.flatMap(order => {
            const items = Array.isArray(order.items) ? order.items : [];

            return items.map((item, index) => {
                const price = Number(item.price || item.unitPrice || item.totalAmount || 0);
                const quantity = Number(item.quantity || 1);
                const costPrice = Number(item.costPrice || item.cost || item.purchasePrice || item.price || 0);
                const markup = Math.max(0, price - costPrice);

                return {
                    id: `${order.id}-${item.id || index}`,
                    orderId: order.id,
                    productName: item.name || item.productName || `Замовлення #${order.id}`,
                    category: resolveCategory(order, item),
                    warehouse: resolveWarehouse(order, item),
                    quantity,
                    costPrice,
                    price,
                    markup,
                };
            });
        });
    }, [orders]);

    const categories = useMemo(() => {
        return [...new Set(orderRows.map(row => row.category).filter(Boolean))];
    }, [orderRows]);

    const warehouses = useMemo(() => {
        return [...new Set(orderRows.map(row => row.warehouse).filter(Boolean))];
    }, [orderRows]);

    const filteredOrders = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return orderRows.filter(row => {
            const matchesCategory = selectedCategory ? row.category === selectedCategory : true;
            const matchesWarehouse = selectedWarehouse ? row.warehouse === selectedWarehouse : true;
            const matchesSearch = query
                ? [row.orderId, row.productName, row.category, row.warehouse].join(' ').toLowerCase().includes(query)
                : true;

            return matchesCategory && matchesWarehouse && matchesSearch;
        });
    }, [orderRows, searchTerm, selectedCategory, selectedWarehouse]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <section className="admin-orders-page">
            <header className="admin-orders-header">
                <div className="admin-orders-title-row">
                    <h1>Замовлення</h1>
                    <span>{filteredOrders.length}</span>
                </div>
            </header>

            <div className="admin-orders-tools">
                <label className="admin-orders-search">
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M10.75 5.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5ZM4 10.75a6.75 6.75 0 1 1 12.05 4.18l3.51 3.51-1.06 1.06-3.51-3.51A6.75 6.75 0 0 1 4 10.75Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Швидкий пошук"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                </label>

                <label className="admin-orders-filter">
                    <span>Склад</span>
                    <select value={selectedWarehouse} onChange={event => setSelectedWarehouse(event.target.value)}>
                        <option value="">Усі склади</option>
                        {warehouses.map(warehouse => (
                            <option key={warehouse} value={warehouse}>{warehouse}</option>
                        ))}
                    </select>
                </label>

                <label className="admin-orders-filter">
                    <span>Категорія</span>
                    <select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}>
                        <option value="">Усі категорії</option>
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </label>

                <button type="button" className="admin-orders-filter-plus">
                    <span>Фільтр</span>
                    <span aria-hidden="true">+</span>
                </button>
            </div>

            <div className="admin-orders-table-wrap">
                <table className="admin-orders-table">
                    <thead>
                        <tr>
                            <th>
                                <span className="admin-orders-sort">Номер замовлення</span>
                            </th>
                            <th>Категорія</th>
                            <th>Податок</th>
                            <th>Собівартість</th>
                            <th>Ціна</th>
                            <th>Націнка</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(row => (
                            <tr key={row.id}>
                                <td>{row.productName}</td>
                                <td>{row.category}</td>
                                <td>{row.quantity} шт.</td>
                                <td>{formatMoney(row.costPrice)}</td>
                                <td>{formatMoney(row.price)}</td>
                                <td>{row.markup} шт.</td>
                                <td>
                                    <button type="button" className="admin-orders-supply-link">Постачання</button>
                                </td>
                            </tr>
                        ))}
                        {filteredOrders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="admin-orders-empty">Нічого не знайдено</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminOrders;
