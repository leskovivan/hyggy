import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminTransfers.css';

const formatDateTime = (value) => {
    if (!value) return '—';

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsed).replace('.', '').replace(',', ', ');
};

const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${Number.isInteger(amount) ? amount : amount.toFixed(2)}₴`;
};

const getWarehouseLabel = (item) => {
    if (item.warehouseFrom && item.warehouseTo && item.warehouseFrom !== item.warehouseTo) {
        return `${item.warehouseFrom} → ${item.warehouseTo}`;
    }

    return item.warehouseTo || item.warehouseFrom || '—';
};

const EditIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.25 5.25 18.75 9.75" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M3.75 20.25 7.65 19.35 19.05 7.95c.6-.6.6-1.55 0-2.15l-.85-.85c-.6-.6-1.55-.6-2.15 0L4.65 16.35l-.9 3.9Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
);

const AdminTransfers = () => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [isDateAsc, setIsDateAsc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/transfers')
            .then(res => res.json())
            .then(data => {
                setTransfers(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error('Помилка завантаження переміщень:', err))
            .finally(() => setLoading(false));
    }, []);

    const normalizedTransfers = useMemo(() => {
        return transfers.map((item, index) => {
            const warehouseFrom = item.warehouseFrom || item.fromWarehouse || item.from || '';
            const warehouseTo = item.warehouseTo || item.toWarehouse || item.to || '';

            return {
                id: item.id ?? index,
                dateRaw: item.date || item.createdAt || item.datetime || '',
                date: formatDateTime(item.date || item.createdAt || item.datetime),
                productName: item.productName || item.products?.map(product => product.name).filter(Boolean).join(', ') || '—',
                amount: Number(item.amount || item.total || 0),
                employee: item.employee || item.employeeName || item.worker || 'Ім’я',
                warehouseFrom: warehouseFrom || 'Загальний склад',
                warehouseTo: warehouseTo || warehouseFrom || 'Загальний склад',
            };
        });
    }, [transfers]);

    const warehouseOptions = useMemo(() => {
        const values = normalizedTransfers
            .flatMap(item => [item.warehouseFrom, item.warehouseTo])
            .filter(Boolean);

        return [...new Set(values)];
    }, [normalizedTransfers]);

    const filteredTransfers = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        const list = normalizedTransfers.filter(item => {
            const warehouseLabel = getWarehouseLabel(item);
            const searchFields = [
                item.date,
                item.productName,
                item.employee,
                item.warehouseFrom,
                item.warehouseTo,
                warehouseLabel,
                item.amount,
            ].join(' ').toLowerCase();

            const matchesSearch = query ? searchFields.includes(query) : true;
            const matchesWarehouse = selectedWarehouse
                ? item.warehouseFrom === selectedWarehouse || item.warehouseTo === selectedWarehouse
                : true;

            return matchesSearch && matchesWarehouse;
        });

        return list.sort((a, b) => {
            const aTime = new Date(a.dateRaw).getTime();
            const bTime = new Date(b.dateRaw).getTime();
            if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
            return isDateAsc ? aTime - bTime : bTime - aTime;
        });
    }, [normalizedTransfers, searchTerm, selectedWarehouse, isDateAsc]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-transfers-container">
            <AdminToolbar
                title="Переміщення"
                count={filteredTransfers.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => navigate('/admin/transfers/add')}
                filters={[
                    {
                        key: 'warehouse',
                        label: 'Склади',
                        value: selectedWarehouse,
                        onChange: setSelectedWarehouse,
                        options: warehouseOptions,
                    },
                ]}
            />

            <div className="admin-transfers-table-wrapper">
                <table className="admin-transfers-table">
                    <thead>
                        <tr>
                            <th>
                                <button
                                    type="button"
                                    className="admin-transfers-sort"
                                    onClick={() => setIsDateAsc(prev => !prev)}
                                >
                                    Дата
                                    <svg viewBox="0 0 12 8" aria-hidden="true">
                                        <path d="M1.41.59 6 5.17 10.59.59 12 2 6 8 0 2 1.41.59Z" />
                                    </svg>
                                </button>
                            </th>
                            <th>Найменування</th>
                            <th>Сума</th>
                            <th>Працівник</th>
                            <th>Склади</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransfers.map(item => (
                            <tr key={item.id}>
                                <td>{item.date}</td>
                                <td>{item.productName}</td>
                                <td>{formatMoney(item.amount)}</td>
                                <td>{item.employee}</td>
                                <td className="transfer-warehouse-cell">{getWarehouseLabel(item)}</td>
                                <td>
                                    <button type="button" className="transfer-action-btn" aria-label="Редагувати переміщення">
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!filteredTransfers.length && (
                            <tr>
                                <td className="admin-transfers-empty" colSpan="6">
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

export default AdminTransfers;
