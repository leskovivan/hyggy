import React, { useEffect, useMemo, useState } from 'react';
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

const formatMoney = (value) => {
    const amount = Number(value || 0);
    return `${Number.isInteger(amount) ? amount : amount.toFixed(2)}₴`;
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

const truncateText = (value, max = 22) => {
    const text = String(value || '—');
    return text.length > max ? `${text.slice(0, max).trim()}...` : text;
};

const EditIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.25 5.25 18.75 9.75" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M3.75 20.25 7.65 19.35 19.05 7.95c.6-.6.6-1.55 0-2.15l-.85-.85c-.6-.6-1.55-.6-2.15 0L4.65 16.35l-.9 3.9Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
);

const AdminWriteOffs = () => {
    const [writeOffs, setWriteOffs] = useState([]);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [isDateAsc, setIsDateAsc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/write-offs').then(res => res.json()),
            fetch('http://localhost:3001/products').then(res => res.json()),
        ])
            .then(([writeOffsData, productsData]) => {
                setWriteOffs(Array.isArray(writeOffsData) ? writeOffsData : []);
                setProducts(Array.isArray(productsData) ? productsData : []);
            })
            .catch(err => console.error('Помилка завантаження списань:', err));
    }, []);

    const productMap = useMemo(() => {
        const map = new Map();
        products.forEach(product => map.set(String(product.id), product));
        return map;
    }, [products]);

    const normalizedWriteOffs = useMemo(() => {
        return writeOffs.map((item, index) => {
            const rawAmount = item.amount ?? item.sum ?? item.totalSum ?? item.total;
            const productIds = [
                ...(item.productId ? [item.productId] : []),
                ...(Array.isArray(item.items) ? item.items.map(product => product.productId || product.id) : []),
                ...(Array.isArray(item.products) ? item.products.map(product => product.productId || product.id) : []),
            ].filter(Boolean);
            const categories = [...new Set(productIds.map(id => productMap.get(String(id))?.category).filter(Boolean))];

            return {
                id: item.id ?? index,
                number: item.number || item.documentNumber || item.id || index + 1,
                dateRaw: item.date || item.createdAt || item.datetime || item.timestamp || '',
                dateLabel: formatDateTime(item.date || item.createdAt || item.datetime || item.timestamp),
                productName: pickProductName(item),
                amount: Number(rawAmount || 0),
                employee: item.employee || item.worker || item.staff || item.employeeName || item.userName || 'Ім’я',
                warehouse: item.warehouse || item.warehouseName || item.storehouse || item.storage || 'Загальний склад',
                reason: item.reason || '—',
                categories,
            };
        });
    }, [writeOffs, productMap]);

    const warehouseOptions = useMemo(
        () => [...new Set(normalizedWriteOffs.map(item => item.warehouse).filter(Boolean))],
        [normalizedWriteOffs]
    );

    const categoryOptions = useMemo(
        () => [...new Set(normalizedWriteOffs.flatMap(item => item.categories).filter(Boolean))],
        [normalizedWriteOffs]
    );

    const reasonOptions = useMemo(
        () => [...new Set(normalizedWriteOffs.map(item => item.reason).filter(reason => reason && reason !== '—'))],
        [normalizedWriteOffs]
    );

    const filteredWriteOffs = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return normalizedWriteOffs.filter(item => {
            const searchFields = [
                item.number,
                item.dateLabel,
                item.productName,
                item.employee,
                item.warehouse,
                item.reason,
                item.amount,
            ].join(' ').toLowerCase();

            const matchesSearch = query ? searchFields.includes(query) : true;
            const matchesWarehouse = selectedWarehouse ? item.warehouse === selectedWarehouse : true;
            const matchesCategory = selectedCategory ? item.categories.includes(selectedCategory) : true;
            const matchesReason = selectedReason ? item.reason === selectedReason : true;

            return matchesSearch && matchesWarehouse && matchesCategory && matchesReason;
        });
    }, [normalizedWriteOffs, searchTerm, selectedWarehouse, selectedCategory, selectedReason]);

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
                    {
                        key: 'category',
                        label: 'Категорії',
                        value: selectedCategory,
                        onChange: setSelectedCategory,
                        options: categoryOptions,
                    },
                    {
                        key: 'reason',
                        label: 'Причина',
                        value: selectedReason,
                        onChange: setSelectedReason,
                        options: reasonOptions,
                    },
                ]}
            />

            <div className="admin-writeoffs-table-wrapper">
                <table className="admin-writeoffs-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>
                                <button
                                    type="button"
                                    className="writeoffs-sort-button"
                                    onClick={() => setIsDateAsc(prev => !prev)}
                                >
                                    Дата
                                    <svg viewBox="0 0 12 8" aria-hidden="true">
                                        <path d="M1.41.59 6 5.17 10.59.59 12 2 6 8 0 2 1.41.59Z" />
                                    </svg>
                                </button>
                            </th>
                            <th>Працівник</th>
                            <th>Склад</th>
                            <th>Товари</th>
                            <th>Причина</th>
                            <th>Сума</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedWriteOffs.map(item => (
                            <tr key={item.id}>
                                <td>{item.number}</td>
                                <td>{item.dateLabel}</td>
                                <td>{item.employee}</td>
                                <td>{item.warehouse}</td>
                                <td title={item.productName}>{truncateText(item.productName)}</td>
                                <td>{item.reason}</td>
                                <td>{formatMoney(item.amount)}</td>
                                <td className="admin-writeoffs-actions-cell">
                                    <button
                                        type="button"
                                        className="edit-action-btn"
                                        onClick={() => navigate(`/admin/write-offs/edit/${item.id}`)}
                                        aria-label="Редагувати списання"
                                    >
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!sortedWriteOffs.length && (
                            <tr>
                                <td colSpan="8" className="writeoffs-empty-state">
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
