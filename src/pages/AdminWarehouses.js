import React, { useState, useEffect } from 'react';

import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';

const AdminWarehouses = () => {
    const [warehouses, setWarehouses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3001/warehouses')
            .then(res => res.json())
            .then(data => {
                setWarehouses(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка завантаження складів:", err));
    }, []);

    return (
        <div className="admin-layout">

            <main className="admin-main-content">
                <AdminToolbar 
                    title="Склади" 
                    count={warehouses.length} 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm}
                    onAdd={() => alert("Додати склад")}
                />

                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Назва ⌄</th>
                                <th>Адреса</th>
                                <th>Сума</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {warehouses.map((w, index) => (
                                <tr key={w.id}>
                                    <td>{index + 1}</td>
                                    <td>{w.name}</td>
                                    <td>{w.address}</td>
                                    <td>{w.totalSum} ₴</td>
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

export default AdminWarehouses; // ОБОВ'ЯЗКОВО!