import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import AdminToolbar from '../components/AdminToolbar';
import './AdminWriteOffs.css';

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

const pickProductName = (item) => {
    if (item.productName) return item.productName;
    if (item.product?.name) return item.product.name;
    if (item.itemName) return item.itemName;
    if (Array.isArray(item.products) && item.products.length) {
        return item.products
            .map(product => product?.name || product?.title || product?.productName)
            .filter(Boolean)
            .join(', ');
    }
    return '—';
};

const AdminWriteOffs = () => {
    const [writeOffs, setWriteOffs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [isDateAsc, setIsDateAsc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/write-offs')
            .then(res => res.json())
            .then(setWriteOffs)
            .catch(err => console.error('Помилка завантаження списань:', err));
    }, []);

    const normalizedWriteOffs = useMemo(() => {
        return writeOffs.map((item, index) => {
            const rawAmount = item.amount ?? item.sum ?? item.totalSum ?? item.total;

            return {
                id: item.id ?? index,
                dateRaw: item.date || item.createdAt || item.datetime || item.timestamp || '',
                dateLabel: formatDateTime(item.date || item.createdAt || item.datetime || item.timestamp),
                productName: pickProductName(item),
                amount: Number(rawAmount || 0),
                employee: item.employee || item.worker || item.staff || item.employeeName || item.userName || '—',
                warehouse: item.warehouse || item.warehouseName || item.storehouse || item.storage || '—',
            };
        });
    }, [writeOffs]);

    const warehouseOptions = useMemo(
        () => [...new Set(normalizedWriteOffs.map(item => item.warehouse).filter(Boolean))],
        [normalizedWriteOffs]
    );

    const filteredWriteOffs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return normalizedWriteOffs.filter(item => {
            const matchesSearch =
                item.dateLabel.toLowerCase().includes(query) ||
                item.productName.toLowerCase().includes(query) ||
                item.employee.toLowerCase().includes(query) ||
                item.warehouse.toLowerCase().includes(query);

            const matchesWarehouse = selectedWarehouse ? item.warehouse === selectedWarehouse : true;

            return matchesSearch && matchesWarehouse;
        });
    }, [normalizedWriteOffs, searchTerm, selectedWarehouse]);

    const sortedWriteOffs = useMemo(() => {
        const list = [...filteredWriteOffs];
        list.sort((a, b) => {
            const aTime = new Date(a.dateRaw).getTime();
            const bTime = new Date(b.dateRaw).getTime();
            if (Number.isNaN(aTime) || Number.isNaN(bTime)) return 0;
            return isDateAsc ? aTime - bTime : bTime - aTime;
        });
        return list;
    }, [filteredWriteOffs, isDateAsc]);

    return (
        <div className="admin-writeoffs-container">
            <AdminToolbar
                title="Списання"
                count={sortedWriteOffs.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => navigate('/admin/write-offs/add')}
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

            <div className="admin-writeoffs-table-wrapper">
                <table className="admin-writeoffs-table">
                        <thead>
                            <tr>
                                <th>
                                    <button
                                        type="button"
                                        className="writeoffs-sort-button"
                                        onClick={() => setIsDateAsc(prev => !prev)}
                                    >
                                        Дата
                                        <span className="sort-icon" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 8">
                                                <path fill="#231F20" fillOpacity="0.5" d="M1.41 0.589844L6 5.16984L10.59 0.589844L12 1.99984L6 7.99984L0 1.99984L1.41 0.589844Z"/>
                                            </svg>
                                        </span>
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
                            {sortedWriteOffs.map(item => (
                                <tr key={item.id}>
                                    <td>{item.dateLabel}</td>
                                    <td>{item.productName}</td>
                                    <td>{item.amount}₴</td>
                                    <td>{item.employee}</td>
                                    <td>{item.warehouse}</td>
                                    <td className="admin-writeoffs-actions-cell">
                                        <button type="button" className="edit-action-btn" title="Редагувати" aria-label="Редагувати списання">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                                <path d="M14.25 5.25L18.75 9.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                                <path d="M3.75 20.25L7.65 19.35L19.05 7.95C19.65 7.35 19.65 6.4 19.05 5.8L18.2 4.95C17.6 4.35 16.65 4.35 16.05 4.95L4.65 16.35L3.75 20.25Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!sortedWriteOffs.length && (
                                <tr>
                                    <td colSpan="6" className="writeoffs-empty-state">
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

export default AdminWriteOffs;