import React, { useState, useEffect, useMemo } from 'react';

import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // СТАН ДЛЯ ФІЛЬТРІВ
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Всі');

    useEffect(() => {
        fetch('http://localhost:3001/orders')
            .then(res => res.json())
            .then(data => {
                setOrders(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    // ЛОГІКА ФІЛЬТРАЦІЇ (працює автоматично при зміні searchTerm або selectedCategory)
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            // Перевірка за категорією
            const matchesCategory = selectedCategory === 'Всі' || order.category === selectedCategory;
            
            // Перевірка за назвою товару або номером замовлення
            const matchesSearch = 
                order.id.toString().includes(searchTerm) || 
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesCategory && matchesSearch;
        });
    }, [orders, searchTerm, selectedCategory]);

    // Унікальні категорії для випадаючого списку
    const categories = ['Всі', ...new Set(orders.map(o => o.category || 'Обідні столи'))];

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-layout">
            
            <main className="admin-main-content">
                
                {/* ПРАЦЮЮЧИЙ ТУЛБАР */}
                <AdminToolbar 
                    title="Замовлення" 
                    count={filteredOrders.length}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                >
                    {/* Вставляємо робочий селект категорій */}
                    <div className="filter-wrapper">
                        <span className="filter-label">Категорія:</span>
                        <select 
                            className="admin-select-filter"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </AdminToolbar>

                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>Назва товару ⌄</th>
                                <th>Категорія</th>
                                <th>Кількість</th>
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
                                        <td>{item.name} <br/><small>#{order.id}</small></td>
                                        <td>{order.category || 'Обідні столи'}</td>
                                        <td>{item.quantity} шт.</td>
                                        <td>{item.costPrice || '1650'}₴</td>
                                        <td>{item.price}₴</td>
                                        <td>0 шт.</td>
                                        <td><button className="table-action-link">Постачання</button></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminOrders;