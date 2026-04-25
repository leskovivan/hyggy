import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';

const AdminSupplies = () => {
    const [supplies, setSupplies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/supplies')
            .then(res => res.json())
            .then(data => setSupplies(data.sort((a, b) => b.id - a.id)))
            .catch(err => console.error("Помилка:", err));
    }, []);

    return (
        <div className="admin-layout">

            <main className="admin-main-content">
                <AdminToolbar 
                    title="Постачання" 
                    count={supplies.length} 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm}
                    onAdd={() => navigate('/admin/supplies/add')} // Перехід на нову сторінку
                >
                    <div className="filter-item">Постачальник ⌄</div>
                    <div className="filter-item">Склад ⌄</div>
                    <div className="filter-item">Рахунок ⌄</div>
                    <div className="filter-item">Категорії ⌄</div>
                </AdminToolbar>

                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Дата ⌄</th>
                                <th>Постачальник</th>
                                <th>Склад</th>
                                <th>Товари</th>
                                <th>Коментарі</th>
                                <th>Статус</th>
                                <th>Сума</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplies.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.supplier || 'BISTRUP'}</td>
                                    <td>{item.warehouse || 'Загальний склад'}</td>
                                    <td>{item.productName || 'Стілець обідній...'}</td>
                                    <td>{item.comment || '—'}</td>
                                    <td>
                                        <span className={`status-text ${item.status === 'Неоплачено' ? 'unpaid' : ''}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{item.amount}₴</td>
                                    <td><button className="edit-action-btn">📝</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminSupplies;