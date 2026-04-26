import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminStores.css';

const AdminStores = () => {
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/stores')
            .then(res => res.json())
            .then(data => {
                setStores(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    const parseAddress = (fullAddress) => {
        if (!fullAddress) return { street: '—', building: '—' };
        const normalized = fullAddress.replace(',', '').trim();
        const parts = normalized.split(/\s+/);
        const building = parts.length > 1 ? parts.pop() : '—';
        const street = parts.length ? parts.join(' ') : normalized;
        return { street, building };
    };

    const filteredStores = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return stores;

        return stores.filter(store => {
            const searchText = [
                store.name,
                store.city,
                store.address,
                store.warehouse,
            ].filter(Boolean).join(' ').toLowerCase();

            return searchText.includes(query);
        });
    }, [stores, searchTerm]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <section className="admin-stores-page">
            <header className="admin-stores-header">
                <div className="admin-stores-title-row">
                    <h1>Магазини</h1>
                    <span>{filteredStores.length}</span>
                </div>

                <button
                    type="button"
                    className="admin-stores-add"
                    onClick={() => navigate('/admin/stores/add')}
                >
                    Додати
                </button>
            </header>

            <div className="admin-stores-tools">
                <label className="admin-stores-search">
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M10.75 5.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5ZM4 10.75a6.75 6.75 0 1 1 12.05 4.18l3.51 3.51-1.06 1.06-3.51-3.51A6.75 6.75 0 0 1 4 10.75Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Швидкий пошук"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                </label>

                <button type="button" className="admin-stores-filter">
                    <span>Фільтр</span>
                    <span aria-hidden="true">+</span>
                </button>
            </div>

            <div className="admin-stores-table-wrap">
                <table className="admin-stores-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>
                                <span className="admin-stores-sort">Назва</span>
                            </th>
                            <th>Вулиця</th>
                            <th>№ будинку</th>
                            <th>Заг. сума товарів</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStores.map((store, idx) => {
                            const { street, building } = parseAddress(store.address);
                            return (
                                <tr key={store.id}>
                                    <td>{idx + 1}</td>
                                    <td>{store.name}</td>
                                    <td>{street}</td>
                                    <td>{building}</td>
                                    <td>{store.totalProductsSum || '1650'}₴</td>
                                    <td className="admin-stores-actions">
                                        <button
                                            type="button"
                                            className="admin-stores-edit"
                                            onClick={() => navigate(`/admin/stores/edit/${store.id}`)}
                                            aria-label="Редагувати магазин"
                                        >
                                            <svg aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M5 19h1.42l9.27-9.27-1.42-1.42L5 17.58V19Zm-2 2v-4.25L15.69 4.06a2 2 0 0 1 2.83 0l1.42 1.42a2 2 0 0 1 0 2.83L7.25 21H3Zm12.35-11.35-1-1 1.42 1.42-.42-.42Z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminStores;
