import React, { useState, useEffect } from 'react';

import AdminToolbar from '../components/AdminToolbar';
import './AdminStock.css';

const AdminStock = () => {
    const [stock, setStock] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/stock')
            .then(res => res.json())
            .then(data => {
                setStock(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка завантаження залишків:", err));
    }, []);

    return (
        <div className="admin-stock-container">

            <main className="admin-main-content">
                <AdminToolbar 
                    title="Залишки" 
                    count={stock.length} 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm}
                >
                    <div className="filter-item">Склад ⌄</div>
                    <div className="filter-item">Категорія ⌄</div>
                </AdminToolbar>

                <div className="admin-stock-table-wrapper">
                    <table className="admin-stock-table">
                        <thead>
                            <tr>
                                <th>Назва ⌄</th>
                                <th>Категорія</th>
                                <th>Залишки</th>
                                <th>Собівартість</th>
                                <th>Сума</th>
                                <th>Ліміт</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {stock.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.quantity} шт.</td>
                                    <td>{item.costPrice} ₴</td>
                                    <td>{item.totalValue} ₴</td>
                                    <td>{item.limit} шт.</td>
                                    <td>
                                        <button className="table-action-link">Постачання</button>
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

export default AdminStock; // ОБОВ'ЯЗКОВО!