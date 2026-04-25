import React, { useState, useEffect, useMemo } from 'react';
import AdminToolbar from '../components/AdminToolbar';
import './AdminClients.css';

const AdminClients = () => {
    const [clients, setClients] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');

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

    const groups = useMemo(
        () => [...new Set(clients.map(client => client.group).filter(Boolean))],
        [clients]
    );

    const filteredClients = useMemo(() => {
        return clients.filter(client => 
            (
                client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.email?.toLowerCase().includes(searchTerm.toLowerCase())
            ) &&
            (selectedGroup ? String(client.group) === String(selectedGroup) : true)
        );
    }, [clients, searchTerm, selectedGroup]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-clients-container">
            <AdminToolbar 
                title="Клієнти" 
                count={filteredClients.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={[
                    {
                        key: 'group',
                        label: 'Група',
                        value: selectedGroup,
                        onChange: setSelectedGroup,
                        options: groups,
                    },
                ]}
            />

            <div className="admin-clients-table-wrapper">
                <table className="admin-clients-table">
                        <thead>
                            <tr>
                                <th>
                                    Ім'я
                                    <span className="sort-icon" aria-hidden="true">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8">
                                            <path fill="#231F20" fillOpacity="0.5" d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z"/>
                                        </svg>
                                    </span>
                                </th>
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
                                const stats = getClientStats(client.id);

                                return (
                                    <tr key={client.id}>
                                        <td>{client.name || '—'}</td>
                                        <td>{client.surname || '—'}</td>
                                        <td>{client.email || '—'}</td>
                                        <td>{client.phone || '—'}</td>
                                        <td>{stats.total} ₴</td>
                                        <td>{stats.average} ₴</td>
                                        <td className="admin-clients-actions-cell">
                                            <button className="delete-action-btn" title="Видалити" type="button" aria-label="Видалити клієнта">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                    <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                                    <path d="M9.5 3H14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                                    <path d="M18.5 7L17.8 18.2C17.74 19.24 16.88 20.05 15.84 20.05H8.16C7.12 20.05 6.26 19.24 6.2 18.2L5.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                                    <path d="M10 11V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                                    <path d="M14 11V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default AdminClients;