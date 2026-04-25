import React, { useState, useEffect, useMemo } from 'react';
import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Завантажуємо дані паралельно
        Promise.all([
            fetch('http://localhost:3001/users').then(res => res.json()),
            fetch('http://localhost:3001/orders').then(res => res.json())
        ])
        .then(([usersData, ordersData]) => {
            setClients(usersData);
            setOrders(ordersData);
            setLoading(false);
        })
        .catch(err => console.error("Помилка завантаження:", err));
    }, []);

    // Функція для розрахунку статистики конкретного клієнта
    const getClientStats = (userId) => {
        const userOrders = orders.filter(order => String(order.userId) === String(userId));
        
        const totalSpent = userOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
        const averageOrder = userOrders.length > 0 ? (totalSpent / userOrders.length) : 0;
        const lastOrder = userOrders.length > 0 ? userOrders[0].date : 'Немає замовлень';

        return {
            total: totalSpent.toFixed(2),
            average: averageOrder.toFixed(2),
            count: userOrders.length,
            lastVisit: lastOrder
        };
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client => 
            client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [clients, searchTerm]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-layout">
            <main className="admin-main-content">
                <AdminToolbar 
                    title="Клієнти" 
                    count={filteredClients.length}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                />

                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>Ім'я ⌄</th>
                                <th>Прізвище</th>
                                <th>Пошта</th>
                                <th>Телефон</th>
                                <th>Загальна сума</th>
                                <th>Середній чек</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredClients.map(client => {
                                // Отримуємо реальні цифри для кожного клієнта
                                const stats = getClientStats(client.id);

                                return (
                                    <tr key={client.id}>
                                        <td>{client.name || '—'}</td>
                                        <td>{client.surname || '—'}</td>
                                        <td>{client.email}</td>
                                        <td>{client.phone || '—'}</td>
                                        {/* Виводимо розраховані дані */}
                                        <td style={{ fontWeight: '600' }}>{stats.total} ₴</td>
                                        <td>{stats.average} ₴</td>
                                        <td>
                                            <button className="delete-action-btn" title="Видалити">🗑</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminClients;