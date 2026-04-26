import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminStock.css';

const DEFAULT_WAREHOUSE = 'Загальний склад';

const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${Number.isInteger(amount) ? amount : amount.toFixed(2)}₴`;
};

const formatQuantity = (value) => `${Number(value || 0)} шт.`;

const AdminStock = () => {
    const [stock, setStock] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/stock')
            .then(res => res.json())
            .then(data => {
                setStock(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error('Помилка завантаження залишків:', err))
            .finally(() => setLoading(false));
    }, []);

    const normalizedStock = useMemo(() => {
        return stock.map((item, index) => {
            const quantity = Number(item.quantity || item.stock || item.balance || 0);
            const costPrice = Number(item.costPrice || item.purchasePrice || item.price || 0);
            const totalValue = Number(item.totalValue || item.amount || quantity * costPrice || 0);

            return {
                id: item.id ?? index,
                name: item.name || item.productName || '—',
                category: item.category || '—',
                quantity,
                costPrice,
                totalValue,
                limit: Number(item.limit || item.minLimit || 0),
                warehouse: item.warehouse || item.storehouse || DEFAULT_WAREHOUSE,
            };
        });
    }, [stock]);

    const categoryOptions = useMemo(
        () => [...new Set(normalizedStock.map(item => item.category).filter(category => category && category !== '—'))],
        [normalizedStock]
    );

    const warehouseOptions = useMemo(
        () => [...new Set(normalizedStock.map(item => item.warehouse).filter(Boolean))],
        [normalizedStock]
    );

    const filteredStock = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return normalizedStock.filter(item => {
            const searchFields = [
                item.name,
                item.category,
                item.warehouse,
                item.quantity,
                item.costPrice,
                item.totalValue,
                item.limit,
            ].join(' ').toLowerCase();

            const matchesSearch = query ? searchFields.includes(query) : true;
            const matchesWarehouse = selectedWarehouse ? item.warehouse === selectedWarehouse : true;
            const matchesCategory = selectedCategory ? item.category === selectedCategory : true;

            return matchesSearch && matchesWarehouse && matchesCategory;
        });
    }, [normalizedStock, searchTerm, selectedWarehouse, selectedCategory]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-stock-container">
            <AdminToolbar
                title="Залишки"
                count={filteredStock.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                showFilterButton={false}
                filters={[
                    {
                        key: 'warehouse',
                        label: 'Склад',
                        value: selectedWarehouse,
                        onChange: setSelectedWarehouse,
                        options: warehouseOptions,
                    },
                    {
                        key: 'category',
                        label: 'Категорія',
                        value: selectedCategory,
                        onChange: setSelectedCategory,
                        options: categoryOptions,
                    },
                ]}
            />

            <div className="admin-stock-table-wrapper">
                <table className="admin-stock-table">
                    <thead>
                        <tr>
                            <th>
                                <span className="admin-stock-sort">
                                    Назва
                                    <svg viewBox="0 0 12 8" aria-hidden="true">
                                        <path d="M1.41.59 6 5.17 10.59.59 12 2 6 8 0 2 1.41.59Z" />
                                    </svg>
                                </span>
                            </th>
                            <th>Категорія</th>
                            <th>Залишки</th>
                            <th>Собівартість</th>
                            <th>Сума</th>
                            <th>Ліміт</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStock.map(item => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{formatQuantity(item.quantity)}</td>
                                <td>{formatMoney(item.costPrice)}</td>
                                <td>{formatMoney(item.totalValue)}</td>
                                <td>{formatQuantity(item.limit)}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="admin-stock-supply-link"
                                        onClick={() => navigate('/admin/supplies/add')}
                                    >
                                        Постачання
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!filteredStock.length && (
                            <tr>
                                <td className="admin-stock-empty" colSpan="7">
                                    Нічого не знайдено
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStock;
