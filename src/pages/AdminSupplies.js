import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminToolbar from '../components/AdminToolbar';

import './AdminSupplies.css';

const API_URL = 'http://localhost:3001/supplies';

const getFirstValue = (...values) => values.find(value => value !== undefined && value !== null && value !== '');

const getProductTitle = (item) => {
    const directName = getFirstValue(item.productName, item.product, item.productsName);

    if (directName) {
        return directName;
    }

    const list = item.products || item.items || item.goods || [];

    if (Array.isArray(list) && list.length > 0) {
        return list
            .map(product => getFirstValue(product.productName, product.name, product.title, product.product))
            .filter(Boolean)
            .join(', ');
    }

    return '—';
};

const parseDate = (value) => {
    if (!value) {
        return 0;
    }

    const parsed = new Date(value);

    if (!Number.isNaN(parsed.getTime())) {
        return parsed.getTime();
    }

    const match = String(value).match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,\s*(\d{1,2}):(\d{2}))?/);

    if (!match) {
        return 0;
    }

    const [, day, month, year, hours = '0', minutes = '0'] = match;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes)).getTime();
};

const formatDate = (value) => {
    if (!value) {
        return '—';
    }

    const timestamp = parseDate(value);

    if (!timestamp) {
        return String(value);
    }

    return new Intl.DateTimeFormat('uk-UA', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(timestamp));
};

const formatAmount = (value) => {
    const amount = Number(value || 0);

    if (!Number.isFinite(amount)) {
        return '0₴';
    }

    return `${Number.isInteger(amount) ? amount : amount.toFixed(2)}₴`;
};

const normalizeSupply = (item, index) => {
    const amount = getFirstValue(item.amount, item.total, item.totalAmount, item.sum, 0);
    const date = getFirstValue(item.date, item.createdAt, item.datetime, item.receivedAt);

    return {
        ...item,
        rowId: getFirstValue(item.id, item.number, index + 1),
        number: getFirstValue(item.number, item.documentNumber, item.id, index + 1),
        date,
        dateLabel: formatDate(date),
        supplier: getFirstValue(item.supplier, item.vendor, item.partner, '—'),
        warehouse: getFirstValue(item.warehouse, item.warehouseName, item.storage, 'Загальний склад'),
        productsTitle: getProductTitle(item),
        status: getFirstValue(item.status, 'Неоплачено'),
        amount,
        amountLabel: formatAmount(amount),
        sortDate: parseDate(date),
    };
};

const EditIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 20h4.4L19.8 8.6a2.1 2.1 0 0 0 0-3L18.4 4.2a2.1 2.1 0 0 0-3 0L4 15.6V20Z" />
        <path d="m14 5.6 4.4 4.4" />
    </svg>
);

const AdminSupplies = () => {
    const [supplies, setSupplies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isDateAsc, setIsDateAsc] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => {
                setSupplies(Array.isArray(data) ? data : []);
            })
            .catch(err => console.error('Помилка завантаження постачань:', err));
    }, []);

    const preparedSupplies = useMemo(
        () => supplies.map(normalizeSupply),
        [supplies]
    );

    const supplierOptions = useMemo(
        () => [...new Set(preparedSupplies.map(item => item.supplier).filter(item => item && item !== '—'))],
        [preparedSupplies]
    );

    const warehouseOptions = useMemo(
        () => [...new Set(preparedSupplies.map(item => item.warehouse).filter(Boolean))],
        [preparedSupplies]
    );

    const statusOptions = useMemo(
        () => [...new Set(preparedSupplies.map(item => item.status).filter(Boolean))],
        [preparedSupplies]
    );

    const filteredSupplies = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return preparedSupplies
            .filter(item => {
                const searchable = [
                    item.number,
                    item.dateLabel,
                    item.supplier,
                    item.warehouse,
                    item.productsTitle,
                    item.status,
                    item.amountLabel,
                ].join(' ').toLowerCase();

                const matchesSearch = query ? searchable.includes(query) : true;
                const matchesSupplier = selectedSupplier ? item.supplier === selectedSupplier : true;
                const matchesWarehouse = selectedWarehouse ? item.warehouse === selectedWarehouse : true;
                const matchesStatus = selectedStatus ? item.status === selectedStatus : true;

                return matchesSearch && matchesSupplier && matchesWarehouse && matchesStatus;
            })
            .sort((a, b) => {
                if (a.sortDate === b.sortDate) {
                    return String(b.number).localeCompare(String(a.number), 'uk', { numeric: true });
                }

                return isDateAsc ? a.sortDate - b.sortDate : b.sortDate - a.sortDate;
            });
    }, [isDateAsc, preparedSupplies, searchTerm, selectedStatus, selectedSupplier, selectedWarehouse]);

    return (
        <div className="admin-supplies-page">
            <AdminToolbar
                title="Постачання"
                count={filteredSupplies.length}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onAdd={() => navigate('/admin/supplies/add')}
                filters={[
                    {
                        key: 'supplier',
                        label: 'Постачальник',
                        value: selectedSupplier,
                        onChange: setSelectedSupplier,
                        options: supplierOptions,
                    },
                    {
                        key: 'warehouse',
                        label: 'Склад',
                        value: selectedWarehouse,
                        onChange: setSelectedWarehouse,
                        options: warehouseOptions,
                    },
                    {
                        key: 'status',
                        label: 'Статус',
                        value: selectedStatus,
                        onChange: setSelectedStatus,
                        options: statusOptions,
                    },
                ]}
            />

            <div className="supplies-table-wrapper">
                <table className="supplies-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>
                                <button
                                    type="button"
                                    className="supplies-sort-button"
                                    onClick={() => setIsDateAsc(current => !current)}
                                >
                                    Дата <span aria-hidden="true">{isDateAsc ? '⌃' : '⌄'}</span>
                                </button>
                            </th>
                            <th>Постачальник</th>
                            <th>Склад</th>
                            <th>Товари</th>
                            <th>Статус</th>
                            <th>Сума</th>
                            <th aria-label="Дії"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSupplies.map(item => (
                            <tr key={item.rowId}>
                                <td>{item.number}</td>
                                <td>{item.dateLabel}</td>
                                <td>{item.supplier}</td>
                                <td>{item.warehouse}</td>
                                <td className="supplies-product-cell" title={item.productsTitle}>{item.productsTitle}</td>
                                <td>
                                    <span className="supplies-status">{item.status}</span>
                                </td>
                                <td>{item.amountLabel}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="supply-action-btn"
                                        aria-label={`Редагувати постачання ${item.number}`}
                                        onClick={() => navigate(`/admin/supplies/edit/${item.rowId}`)}
                                    >
                                        <EditIcon />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredSupplies.length === 0 && (
                            <tr>
                                <td className="supplies-empty" colSpan="8">Постачання не знайдено</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminSupplies;
