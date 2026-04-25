import React, { useState, useEffect, useMemo } from 'react';

import AdminToolbar from '../components/AdminToolbar';
import './AdminTransfers.css';

const AdminTransfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Завантажуємо дані переміщень
        fetch('http://localhost:3001/transfers')
            .then(res => res.json())
            .then(data => {
                setTransfers(data.sort((a, b) => b.id - a.id));
                setLoading(false);
            })
            .catch(err => console.error("Помилка завантаження переміщень:", err));
    }, []);

    // Фільтрація за назвою товару або ім'ям працівника
    const filteredTransfers = useMemo(() => {
        return transfers.filter(t => 
            t.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.employee?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transfers, searchTerm]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-transfers-container">


            <main className="admin-main-content">
                {/* Тулбар з кнопкою "Додати" */}
                <AdminToolbar 
                    title="Переміщення" 
                    count={filteredTransfers.length}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAdd={() => alert("Відкрити форму переміщення")}
                >
                    <div className="filter-item">Склади ⌄</div>
                </AdminToolbar>

                <div className="admin-transfers-table-wrapper">
                    <table className="admin-transfers-table">
                        <thead>
                            <tr>
                                <th>Дата ⌄</th>
                                <th>Найменування</th>
                                <th>Сума</th>
                                <th>Працівник</th>
                                <th>Склади</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransfers.map(t => (
                                <tr key={t.id}>
                                    <td>{t.date}</td>
                                    <td className="product-cell">
                                        <span className="product-name">{t.productName}</span>
                                    </td>
                                    <td>{t.amount}₴</td>
                                    <td>{t.employee || 'Ім\'я'}</td>
                                    <td>
                                        <div style={{fontSize: '12px'}}>
                                            <strong>З:</strong> {t.warehouseFrom} <br/>
                                            <strong>В:</strong> {t.warehouseTo || 'Загальний склад'}
                                        </div>
                                    </td>
                                    <td className="table-actions">
                                        <button className="edit-action-btn">📝</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminTransfers;