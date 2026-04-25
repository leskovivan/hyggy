import React, { useState, useEffect } from 'react';

import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';
import './AdminWarehouses.css';

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
        <div className="admin-warehouses-container">
            <AdminToolbar 
                title="Склади" 
                count={warehouses.length} 
                searchTerm={searchTerm} 
                onSearchChange={setSearchTerm}
                onAdd={() => alert("Додати склад")}
            />

            <div className="admin-warehouses-table-wrapper">
                    <table className="admin-warehouses-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>
                                    Назва
                                    <span className="sort-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8">
                                            <path fill="#231F20" fillOpacity="0.5" d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z"/>
                                        </svg>
                                    </span>
                                </th>
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
                                    <td>{w.totalSum}₴</td>
                                    <td className="admin-warehouses-table-actions">
                                        <div className="action-dots" title="Редагувати">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default AdminWarehouses; // ОБОВ'ЯЗКОВО!