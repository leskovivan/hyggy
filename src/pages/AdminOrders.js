import React, { useState, useEffect, useMemo } from 'react';
import AdminToolbar from '../components/AdminToolbar';
import './AdminOrders.css';

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
                setOrders(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    // Унікальні значення для фільтрів
    const categories = [...new Set(orders.map(o => o.category).filter(Boolean))];
    const warehouses = [...new Set(orders.map(o => o.warehouse).filter(Boolean))];

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesCategory = selectedCategory ? order.category === selectedCategory : true;
            const matchesWarehouse = selectedWarehouse ? order.warehouse === selectedWarehouse : true;
            const matchesSearch =
                order.id.toString().includes(searchTerm) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesCategory && matchesWarehouse && matchesSearch;
        });
    }, [orders, searchTerm, selectedCategory, selectedWarehouse]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-orders">
            <AdminToolbar
                title="Замовлення"
                count={filteredOrders.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={[
                    {
                        key: 'warehouse',
                        label: 'Склад',
                        value: selectedWarehouse,
                        onChange: setSelectedWarehouse,
                        options: warehouses,
                    },
                    {
                        key: 'category',
                        label: 'Категорія',
                        value: selectedCategory,
                        onChange: setSelectedCategory,
                        options: categories,
                    },
                ]}
            />

            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Номер замовлення</th>
                        <th>Категорія</th>
                        <th>Податок</th>
                        <th>Собівартість</th>
                        <th>Ціна</th>
                        <th>Націнка</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order =>
                        order.items.map((item, idx) => (
                            <tr key={`${order.id}-${idx}`}>
                                <td>
                                    {item.name}
                                    <span className="order-id">#{order.id}</span>
                                </td>
                                <td>{order.category || '—'}</td>
                                <td>{item.quantity} шт.</td>
                                <td>{item.costPrice || '—'}₴</td>
                                <td>{item.price}₴</td>
                                <td>0 шт.</td>
                                <td>
                                    <button className="supply-link">Постачання</button>
                                </td>
                            </tr>
                        ))
                    )}
                    {filteredOrders.length === 0 && (
                        <tr>
                            <td colSpan="7" className="empty-row">Нічого не знайдено</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;