import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminTransferAdd.css';

const pad = (value) => String(value).padStart(2, '0');

const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    return `${year}-${month}-${day}`;
};

const formatDateLabel = (value) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
};

const parseDateLabel = (value) => {
    const match = value.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
    if (!match) return '';

    const [, day, month, year] = match;
    return `${year}-${pad(month)}-${pad(day)}`;
};

const createItem = () => ({
    productId: '',
    packing: '',
    quantity: '',
});

const packingOptions = ['шт', 'упаковка', 'комплект'];

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.6 5 19V8H4V6h5V5c0-.6.2-1.1.6-1.5S10.4 3 11 3h2c.6 0 1.1.2 1.5.6S15 4.4 15 5v1h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-6-2h2V5h-2v1Zm-2 11h1.8v-7H9v7Zm4.2 0H15v-7h-1.8v7Z" />
    </svg>
);

const MultiplyIcon = () => (
    <span className="admin-transfer-add-multiply" aria-hidden="true">×</span>
);

const AdminTransferAdd = () => {
    const navigate = useNavigate();
    const now = useMemo(() => new Date(), []);

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [date, setDate] = useState(formatDateInput(now));
    const [dateDisplay, setDateDisplay] = useState(formatDateLabel(formatDateInput(now)));
    const [hour, setHour] = useState(pad(now.getHours()));
    const [minute, setMinute] = useState(pad(now.getMinutes()));
    const [warehouseFrom, setWarehouseFrom] = useState('');
    const [warehouseTo, setWarehouseTo] = useState('');
    const [comment, setComment] = useState('');
    const [items, setItems] = useState([createItem(), createItem()]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/products').then(res => res.json()),
            fetch('http://localhost:3001/warehouses').then(res => res.json()),
            fetch('http://localhost:3001/employees').then(res => res.json()),
        ])
            .then(([productsData, warehousesData, employeesData]) => {
                const safeProducts = Array.isArray(productsData) ? productsData : [];
                const safeWarehouses = Array.isArray(warehousesData) ? warehousesData : [];
                const safeEmployees = Array.isArray(employeesData) ? employeesData : [];

                setProducts(safeProducts);
                setWarehouses(safeWarehouses);
                setEmployees(safeEmployees);

                const firstWarehouse = safeWarehouses[0]?.name || safeWarehouses[0]?.id || '';
                setWarehouseFrom(prev => prev || firstWarehouse);
                setWarehouseTo(prev => prev || safeWarehouses[1]?.name || safeWarehouses[1]?.id || firstWarehouse);
            })
            .catch(error => {
                console.error('Помилка завантаження даних для переміщення:', error);
            });
    }, []);

    const productMap = useMemo(() => {
        const map = new Map();
        products.forEach(product => map.set(String(product.id), product));
        return map;
    }, [products]);

    const updateItem = (index, field, value) => {
        setItems(prevItems => prevItems.map((item, itemIndex) => (
            itemIndex === index ? { ...item, [field]: value } : item
        )));
    };

    const addItem = () => setItems(prevItems => [...prevItems, createItem()]);

    const removeItem = (index) => {
        setItems(prevItems => {
            if (prevItems.length === 1) return prevItems;
            return prevItems.filter((_, itemIndex) => itemIndex !== index);
        });
    };

    const updateDateDisplay = (value) => {
        setDateDisplay(value);
        const parsed = parseDateLabel(value);
        if (parsed) setDate(parsed);
    };

    const updateTime = (setter, max) => (value) => {
        const normalized = Math.max(0, Math.min(max, Number(value || 0)));
        setter(pad(normalized));
    };

    const resolveItem = (item) => {
        const product = productMap.get(String(item.productId));
        const quantity = Number(String(item.quantity).replace(',', '.')) || 0;
        const unitPrice = Number(product?.price || 0);

        return {
            productId: String(item.productId),
            productName: product?.name || '',
            packing: item.packing || '',
            quantity,
            unitPrice,
            lineAmount: quantity * unitPrice,
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const normalizedItems = items
            .map(resolveItem)
            .filter(item => item.productId && item.quantity > 0);

        if (!warehouseFrom || !warehouseTo) {
            alert('Оберіть склади для переміщення');
            return;
        }

        if (!normalizedItems.length) {
            alert('Додайте хоча б один товар з кількістю більше 0');
            return;
        }

        const parsedDate = parseDateLabel(dateDisplay) || date;
        const amount = normalizedItems.reduce((sum, item) => sum + item.lineAmount, 0);
        const employeeName = employees[0]?.name || employees[0]?.login || 'Адміністратор';

        const payload = {
            id: String(Date.now()),
            date: `${parsedDate}T${pad(hour)}:${pad(minute)}:00`,
            warehouseFrom,
            warehouseTo,
            comment,
            employee: employeeName,
            amount: Math.round(amount * 100) / 100,
            productName: normalizedItems.map(item => item.productName).join(', '),
            items: normalizedItems,
            products: normalizedItems.map(item => ({
                id: item.productId,
                name: item.productName,
                packing: item.packing,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                lineAmount: item.lineAmount,
            })),
        };

        setIsSaving(true);

        try {
            const response = await fetch('http://localhost:3001/transfers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не вдалося зберегти переміщення');
            }

            navigate('/admin/transfers');
        } catch (error) {
            console.error('Помилка збереження переміщення:', error);
            alert('Не вдалося зберегти переміщення');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-transfer-add-page">
            <div className="admin-transfer-add-header">
                <button
                    type="button"
                    className="admin-transfer-add-back"
                    onClick={() => navigate('/admin/transfers')}
                    aria-label="Повернутися до переміщень"
                >
                    <span className="admin-transfer-add-back-icon">‹</span>
                    <span>Переміщення товарів</span>
                </button>
            </div>

            <form className="admin-transfer-add-form" onSubmit={handleSubmit}>
                <div className="admin-transfer-add-main">
                    <div className="admin-transfer-add-field">
                        <label className="admin-transfer-add-label" htmlFor="transfer-date">Дата та час переміщення</label>
                        <div className="admin-transfer-add-date-time">
                            <input
                                id="transfer-date"
                                type="text"
                                className="admin-transfer-add-input admin-transfer-add-date"
                                value={dateDisplay}
                                onChange={event => updateDateDisplay(event.target.value)}
                                onBlur={() => setDateDisplay(formatDateLabel(parseDateLabel(dateDisplay) || date))}
                                inputMode="numeric"
                            />
                            <input
                                type="number"
                                min="0"
                                max="23"
                                className="admin-transfer-add-input admin-transfer-add-time"
                                value={hour}
                                onChange={event => updateTime(setHour, 23)(event.target.value)}
                                aria-label="Година"
                            />
                            <span className="admin-transfer-add-separator">:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                className="admin-transfer-add-input admin-transfer-add-time"
                                value={minute}
                                onChange={event => updateTime(setMinute, 59)(event.target.value)}
                                aria-label="Хвилина"
                            />
                        </div>
                    </div>

                    <div className="admin-transfer-add-field">
                        <label className="admin-transfer-add-label" htmlFor="transfer-from">Зі складу</label>
                        <select
                            id="transfer-from"
                            className="admin-transfer-add-input admin-transfer-add-select"
                            value={warehouseFrom}
                            onChange={event => setWarehouseFrom(event.target.value)}
                        >
                            <option value="">Виберіть...</option>
                            {warehouses.map(item => (
                                <option key={item.id} value={item.name || String(item.id)}>
                                    {item.name || `Склад ${item.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-transfer-add-field">
                        <label className="admin-transfer-add-label" htmlFor="transfer-to">На склад</label>
                        <select
                            id="transfer-to"
                            className="admin-transfer-add-input admin-transfer-add-select"
                            value={warehouseTo}
                            onChange={event => setWarehouseTo(event.target.value)}
                        >
                            <option value="">Виберіть...</option>
                            {warehouses.map(item => (
                                <option key={item.id} value={item.name || String(item.id)}>
                                    {item.name || `Склад ${item.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-transfer-add-field admin-transfer-add-field-top">
                        <label className="admin-transfer-add-label" htmlFor="transfer-comment">Коментар</label>
                        <textarea
                            id="transfer-comment"
                            className="admin-transfer-add-input admin-transfer-add-textarea"
                            placeholder="Введіть текст..."
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-transfer-add-products">
                    <div className="admin-transfer-add-products-head">
                        <span>Найменування</span>
                        <span>Фасування</span>
                        <span></span>
                        <span>Кількість</span>
                        <span>Сума</span>
                        <span></span>
                    </div>

                    {items.map((item, index) => {
                        const resolvedItem = resolveItem(item);

                        return (
                            <div className="admin-transfer-add-product-row" key={`${index}-${item.productId || 'empty'}`}>
                                <select
                                    className="admin-transfer-add-input admin-transfer-add-select"
                                    value={item.productId}
                                    onChange={event => updateItem(index, 'productId', event.target.value)}
                                    aria-label="Найменування товару"
                                >
                                    <option value="">Виберіть...</option>
                                    {products.map(product => (
                                        <option key={product.id} value={String(product.id)}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>

                                <select
                                    className="admin-transfer-add-input admin-transfer-add-select"
                                    value={item.packing}
                                    onChange={event => updateItem(index, 'packing', event.target.value)}
                                    aria-label="Фасування"
                                >
                                    <option value="">Виберіть...</option>
                                    {packingOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>

                                <MultiplyIcon />

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="admin-transfer-add-input"
                                    value={item.quantity}
                                    onChange={event => updateItem(index, 'quantity', event.target.value)}
                                    aria-label="Кількість"
                                />

                                <input
                                    type="text"
                                    className="admin-transfer-add-input admin-transfer-add-readonly"
                                    value={resolvedItem.lineAmount ? Math.round(resolvedItem.lineAmount * 100) / 100 : ''}
                                    readOnly
                                    aria-label="Сума"
                                />

                                <button
                                    type="button"
                                    className="admin-transfer-add-remove"
                                    onClick={() => removeItem(index)}
                                    aria-label="Видалити рядок"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        );
                    })}

                    <button type="button" className="admin-transfer-add-more" onClick={addItem}>
                        <span aria-hidden="true">+</span>
                        <span>Додати ще</span>
                    </button>
                </div>

                <div className="admin-transfer-add-submit-wrap">
                    <button type="submit" className="admin-transfer-add-submit" disabled={isSaving}>
                        {isSaving ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminTransferAdd;
