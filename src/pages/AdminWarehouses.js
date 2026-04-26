import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminWarehouses.css';

const API_URL = 'http://localhost:3001/warehouses';

const formatMoney = (value) => {
    const amount = Number(value || 0);

    if (!Number.isFinite(amount)) {
        return '0₴';
    }

    return `${Number.isInteger(amount) ? amount : amount.toFixed(2)}₴`;
};

const EditIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4.4L19.8 8.6a2.1 2.1 0 0 0 0-3L18.4 4.2a2.1 2.1 0 0 0-3 0L4 15.6V20Z" />
        <path d="m14 5.6 4.4 4.4" />
    </svg>
);

const AdminWarehouses = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isNameAsc, setIsNameAsc] = useState(true);

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setWarehouses(Array.isArray(data) ? data : []);
            })
            .catch(error => console.error('Помилка завантаження складів:', error));
    }, []);

    const filteredWarehouses = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return warehouses
            .filter(warehouse => {
                if (!query) {
                    return true;
                }

                return [
                    warehouse.id,
                    warehouse.name,
                    warehouse.address,
                    warehouse.totalSum,
                ].filter(Boolean).join(' ').toLowerCase().includes(query);
            })
            .sort((a, b) => {
                const result = String(a.name || '').localeCompare(String(b.name || ''), 'uk', { numeric: true });
                return isNameAsc ? result : -result;
            });
    }, [isNameAsc, searchTerm, warehouses]);

    return (
        <section className="admin-warehouses-page">
            <AdminToolbar
                title="Склади"
                count={filteredWarehouses.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => navigate('/admin/warehouses/add')}
            />

            <div className="admin-warehouses-table-wrapper">
                <table className="admin-warehouses-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <button
                                    type="button"
                                    className="admin-warehouses-sort"
                                    onClick={() => setIsNameAsc(current => !current)}
                                >
                                    Назва <span aria-hidden="true">{isNameAsc ? '⌄' : '⌃'}</span>
                                </button>
                            </th>
                            <th>Адреса</th>
                            <th>Сума</th>
                            <th aria-label="Дії"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredWarehouses.map((warehouse, index) => (
                            <tr key={warehouse.id || index}>
                                <td>{index + 1}</td>
                                <td>{warehouse.name || '—'}</td>
                                <td>{warehouse.address || '—'}</td>
                                <td>{formatMoney(warehouse.totalSum)}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="admin-warehouses-edit"
                                        onClick={() => navigate(`/admin/warehouses/edit/${warehouse.id}`)}
                                        aria-label={`Редагувати склад ${warehouse.name || index + 1}`}
                                    >
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredWarehouses.length === 0 && (
                            <tr>
                                <td className="admin-warehouses-empty" colSpan="5">Склади не знайдено</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminWarehouses;
