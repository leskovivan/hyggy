import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminToolbar from '../components/AdminToolbar';

import './AdminSupplies.css'; // Твій новий ідеальний CSS

const AdminSupplies = () => {
    const [supplies, setSupplies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/supplies')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setSupplies(data.sort((a, b) => b.id - a.id));
                }
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    const filteredSupplies = supplies.filter(s => 
        s.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-layout">

            <main className="admin-main-content">
                <div className="admin-supplies-page">
                    <AdminToolbar 
                        title="Постачання" 
                        count={filteredSupplies.length} 
                        searchTerm={searchTerm} 
                        onSearchChange={setSearchTerm}
                        onAdd={() => navigate('/admin/supplies/add')}
                    >
                        <div className="filter-item">Постачальник ⌄</div>
                        <div className="filter-item">Склад ⌄</div>
                    </AdminToolbar>

                    <div className="supplies-table-wrapper">
                        <table className="supplies-table">
                            <thead>
                                <tr>
                                    <th>№</th>
                                    <th>Дата ⌄</th>
                                    <th>Постачальник</th>
                                    <th>Склад</th>
                                    <th>Товари</th>
                                    <th>Статус</th>
                                    <th>Сума</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSupplies.map(item => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.date}</td>
                                        <td>{item.supplier}</td>
                                        <td>{item.warehouse}</td>
                                        <td>{item.productName}</td>
                                        <td>
                                            <span className={`status-badge ${item.status === 'Неоплачено' ? 'unpaid' : ''}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{item.amount}₴</td>
                                        <td style={{textAlign: 'center'}}>
                                            <button className="edit-action-btn" onClick={() => navigate(`/admin/supplies/edit/${item.id}`)}>📝</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSupplies;