import React, { useState, useEffect } from 'react';
import './AdminBlogEdit.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/orders')
            .then(res => res.json())
            .then(data => {
                // Сортуємо замовлення від нових до старих
                setOrders(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            })
            .catch(err => console.error("Помилка завантаження замовлень:", err));
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        const res = await fetch(`http://localhost:3001/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            setOrders(prev => prev.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Нове': return '#00aaad'; // Твій фірмовий колір
            case 'В дорозі': return '#FFA500';
            case 'Виконано': return '#4CAF50';
            case 'Скасовано': return '#F44336';
            default: return '#666';
        }
    };

    if (loading) return <div className="admin-blog-edit">Завантаження замовлень...</div>;

    return (
        <div className="admin-blog-edit">
            <h2 className="section-title">Замовлення <span style={{ color: '#666', fontSize: '18px' }}>{orders.length}</span></h2>

            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', marginTop: '20px' }}>
                <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', fontSize: '14px', color: '#666' }}>
                        <th style={{ padding: '15px' }}>№ та Дата</th>
                        <th>Клієнт</th>
                        <th>Товари</th>
                        <th>Сума</th>
                        <th>Статус</th>
                        <th style={{ padding: '15px' }}>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '15px' }}>
                                <div style={{ fontWeight: '600' }}>#{order.id}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>{order.date}</div>
                            </td>
                            <td>
                                <div style={{ fontWeight: '500' }}>{order.customerName}</div>
                                <div style={{ fontSize: '12px', color: '#888' }}>{order.phone}</div>
                            </td>
                            <td style={{ fontSize: '13px' }}>
                                {order.items.map(item => (
                                    <div key={item.id}>• {item.name} (x{item.quantity})</div>
                                ))}
                            </td>
                            <td style={{ fontWeight: '600' }}>{order.totalPrice}$</td>
                            <td>
                                <span style={{ 
                                    padding: '4px 10px', 
                                    borderRadius: '12px', 
                                    fontSize: '12px', 
                                    color: '#fff', 
                                    background: getStatusColor(order.status) 
                                }}>
                                    {order.status}
                                </span>
                            </td>
                            <td style={{ padding: '15px' }}>
                                <select 
                                    value={order.status} 
                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ddd' }}
                                >
                                    <option value="Нове">Нове</option>
                                    <option value="В дорозі">В дорозі</option>
                                    <option value="Виконано">Виконано</option>
                                    <option value="Скасовано">Скасовано</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminOrders;