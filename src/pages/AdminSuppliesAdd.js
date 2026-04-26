import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './AdminSuppliesAdd.css';

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
    packaging: '',
    quantity: '',
    unitPrice: '',
    tax: '',
});

const getFirstValue = (...values) => values.find(value => value !== undefined && value !== null && value !== '');

const hydrateItem = (item) => ({
    productId: String(getFirstValue(item.productId, item.id, '')),
    packaging: getFirstValue(item.packaging, ''),
    quantity: String(getFirstValue(item.quantity, '')),
    unitPrice: String(getFirstValue(item.unitPrice, item.price, '')),
    tax: String(getFirstValue(item.tax, '')),
});

const packingOptions = ['шт', 'упаковка', 'комплект'];

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.6 5 19V8H4V6h5V5c0-.6.2-1.1.6-1.5S10.4 3 11 3h2c.6 0 1.1.2 1.5.6S15 4.4 15 5v1h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-6-2h2V5h-2v1Zm-2 11h1.8v-7H9v7Zm4.2 0H15v-7h-1.8v7Z" />
    </svg>
);

const Operator = ({ children }) => (
    <span className="admin-supplies-add-operator" aria-hidden="true">{children}</span>
);

const AdminSuppliesAdd = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);
    const now = useMemo(() => new Date(), []);

    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);

    const [date, setDate] = useState(formatDateInput(now));
    const [dateDisplay, setDateDisplay] = useState(formatDateLabel(formatDateInput(now)));
    const [hour, setHour] = useState(pad(now.getHours()));
    const [minute, setMinute] = useState(pad(now.getMinutes()));
    const [supplier, setSupplier] = useState('');
    const [warehouse, setWarehouse] = useState('');
    const [comment, setComment] = useState('');
    const [items, setItems] = useState([createItem(), createItem()]);
    const [currentSupply, setCurrentSupply] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/products').then(res => res.json()),
            fetch('http://localhost:3001/warehouses').then(res => res.json()),
        ])
            .then(([productsData, warehousesData]) => {
                const safeProducts = Array.isArray(productsData) ? productsData : [];
                const safeWarehouses = Array.isArray(warehousesData) ? warehousesData : [];
                const brands = [...new Set(safeProducts.map(product => product.brand).filter(Boolean))];

                setProducts(safeProducts);
                setWarehouses(safeWarehouses);
                setSupplierOptions(brands);
                setSupplier(prev => prev || brands[0] || '');
                setWarehouse(prev => prev || safeWarehouses[0]?.name || safeWarehouses[0]?.id || '');
            })
            .catch(error => {
                console.error('Помилка завантаження даних для постачання:', error);
            });
    }, []);

    useEffect(() => {
        if (!isEditing) {
            setCurrentSupply(null);
            return;
        }

        fetch(`http://localhost:3001/supplies/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Не вдалося знайти постачання');
                }

                return res.json();
            })
            .then(data => setCurrentSupply(data))
            .catch(error => {
                console.error('Помилка завантаження постачання:', error);
                alert('Не вдалося завантажити постачання');
                navigate('/admin/supplies');
            });
    }, [id, isEditing, navigate]);

    useEffect(() => {
        if (!currentSupply) {
            return;
        }

        const [rawDate = '', rawTime = ''] = String(currentSupply.date || '').split(',');
        const parsedDate = parseDateLabel(rawDate.trim());
        const [parsedHour = pad(now.getHours()), parsedMinute = pad(now.getMinutes())] = rawTime.trim().split(':');
        const supplyItems = currentSupply.items || currentSupply.products || [];

        if (parsedDate) {
            setDate(parsedDate);
            setDateDisplay(formatDateLabel(parsedDate));
        }

        setHour(pad(Number(parsedHour || now.getHours())));
        setMinute(pad(Number(parsedMinute || now.getMinutes())));
        setSupplier(currentSupply.supplier || '');
        setWarehouse(currentSupply.warehouse || '');
        setComment(currentSupply.comment || '');
        setItems(Array.isArray(supplyItems) && supplyItems.length ? supplyItems.map(hydrateItem) : [createItem()]);
    }, [currentSupply, now]);

    const productMap = useMemo(() => {
        const map = new Map();
        products.forEach(product => map.set(String(product.id), product));
        return map;
    }, [products]);

    const toNumber = (value) => {
        const parsed = Number(String(value).replace(',', '.'));
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const formatMoney = (value) => {
        if (!Number.isFinite(value) || value === 0) return '';
        const rounded = Math.round(value * 100) / 100;
        return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2);
    };

    const resolveItem = (item) => {
        const product = productMap.get(String(item.productId));
        const quantity = toNumber(item.quantity);
        const unitPrice = toNumber(item.unitPrice || product?.price || 0);
        const tax = toNumber(item.tax);
        const amountWithoutTax = quantity * unitPrice;
        const totalAmount = amountWithoutTax + tax;

        return {
            productId: String(item.productId),
            productName: product?.name || '',
            packaging: item.packaging || '',
            quantity,
            unitPrice,
            amountWithoutTax,
            tax,
            totalAmount,
        };
    };

    const updateItem = (index, field, value) => {
        setItems(prevItems => prevItems.map((item, itemIndex) => {
            if (itemIndex !== index) return item;

            const nextItem = { ...item, [field]: value };

            if (field === 'productId') {
                const product = productMap.get(String(value));
                nextItem.unitPrice = product ? String(product.price || '') : '';
            }

            return nextItem;
        }));
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const normalizedItems = items
            .map(resolveItem)
            .filter(item => item.productId && item.quantity > 0);

        if (!supplier) {
            alert('Оберіть постачальника');
            return;
        }

        if (!warehouse) {
            alert('Оберіть склад');
            return;
        }

        if (!normalizedItems.length) {
            alert('Додайте хоча б один товар з кількістю більше 0');
            return;
        }

        const parsedDate = parseDateLabel(dateDisplay) || date;
        const amount = normalizedItems.reduce((sum, item) => sum + item.totalAmount, 0);

        const payload = {
            ...(currentSupply || {}),
            id: isEditing ? String(id) : String(Date.now()),
            date: `${formatDateLabel(parsedDate)}, ${pad(hour)}:${pad(minute)}`,
            supplier,
            warehouse,
            comment,
            status: currentSupply?.status || 'Неоплачено',
            amount: Math.round(amount * 100) / 100,
            productName: normalizedItems.map(item => item.productName).join(', '),
            items: normalizedItems,
            products: normalizedItems.map(item => ({
                id: item.productId,
                name: item.productName,
                packaging: item.packaging,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                amountWithoutTax: item.amountWithoutTax,
                tax: item.tax,
                totalAmount: item.totalAmount,
            })),
        };

        setIsSaving(true);

        try {
            const response = await fetch(`http://localhost:3001/supplies${isEditing ? `/${id}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не вдалося зберегти постачання');
            }

            navigate('/admin/supplies');
        } catch (error) {
            console.error('Помилка збереження постачання:', error);
            alert('Не вдалося зберегти постачання');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-supplies-add-page">
            <div className="admin-supplies-add-header">
                <button
                    type="button"
                    className="admin-supplies-add-back"
                    onClick={() => navigate('/admin/supplies')}
                    aria-label="Повернутися до постачань"
                >
                    <span className="admin-supplies-add-back-icon">‹</span>
                    <span>{isEditing ? 'Редагування постачання' : 'Додавання постачання'}</span>
                </button>
            </div>

            <form className="admin-supplies-add-form" onSubmit={handleSubmit}>
                <div className="admin-supplies-add-main">
                    <div className="admin-supplies-add-field">
                        <label className="admin-supplies-add-label" htmlFor="supply-date">Дата та час постачання</label>
                        <div className="admin-supplies-add-date-time">
                            <input
                                id="supply-date"
                                type="text"
                                className="admin-supplies-add-input admin-supplies-add-date"
                                value={dateDisplay}
                                onChange={event => updateDateDisplay(event.target.value)}
                                onBlur={() => setDateDisplay(formatDateLabel(parseDateLabel(dateDisplay) || date))}
                                inputMode="numeric"
                            />
                            <input
                                type="number"
                                min="0"
                                max="23"
                                className="admin-supplies-add-input admin-supplies-add-time"
                                value={hour}
                                onChange={event => updateTime(setHour, 23)(event.target.value)}
                                aria-label="Година"
                            />
                            <span className="admin-supplies-add-separator">:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                className="admin-supplies-add-input admin-supplies-add-time"
                                value={minute}
                                onChange={event => updateTime(setMinute, 59)(event.target.value)}
                                aria-label="Хвилина"
                            />
                        </div>
                    </div>

                    <div className="admin-supplies-add-field">
                        <label className="admin-supplies-add-label" htmlFor="supply-supplier">Постачальник</label>
                        <select
                            id="supply-supplier"
                            className="admin-supplies-add-input admin-supplies-add-select"
                            value={supplier}
                            onChange={event => setSupplier(event.target.value)}
                        >
                            <option value="">Виберіть...</option>
                            {supplierOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-supplies-add-field">
                        <label className="admin-supplies-add-label" htmlFor="supply-warehouse">Склад</label>
                        <select
                            id="supply-warehouse"
                            className="admin-supplies-add-input admin-supplies-add-select"
                            value={warehouse}
                            onChange={event => setWarehouse(event.target.value)}
                        >
                            <option value="">Виберіть...</option>
                            {warehouses.map(item => (
                                <option key={item.id} value={item.name || String(item.id)}>
                                    {item.name || `Склад ${item.id}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-supplies-add-field admin-supplies-add-field-top">
                        <label className="admin-supplies-add-label" htmlFor="supply-comment">Коментар</label>
                        <textarea
                            id="supply-comment"
                            className="admin-supplies-add-input admin-supplies-add-textarea"
                            placeholder="Введіть текст..."
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-supplies-add-products">
                    <div className="admin-supplies-add-products-head">
                        <span>Найменування</span>
                        <span>Фасування</span>
                        <span>Кількість</span>
                        <span></span>
                        <span>Ціна<br />за одиницю</span>
                        <span></span>
                        <span>Сума<br />без податку</span>
                        <span></span>
                        <span>Податок</span>
                        <span></span>
                        <span>Загальна<br />сума</span>
                        <span></span>
                    </div>

                    {items.map((item, index) => {
                        const resolvedItem = resolveItem(item);

                        return (
                            <div className="admin-supplies-add-product-row" key={`${index}-${item.productId || 'empty'}`}>
                                <select
                                    className="admin-supplies-add-input admin-supplies-add-select"
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
                                    className="admin-supplies-add-input admin-supplies-add-select"
                                    value={item.packaging}
                                    onChange={event => updateItem(index, 'packaging', event.target.value)}
                                    aria-label="Фасування"
                                >
                                    <option value="">Виберіть...</option>
                                    {packingOptions.map(option => (
                                        <option key={option} value={option}>{option}</option>
                                    ))}
                                </select>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    className="admin-supplies-add-input"
                                    value={item.quantity}
                                    onChange={event => updateItem(index, 'quantity', event.target.value)}
                                    aria-label="Кількість"
                                />

                                <Operator>×</Operator>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="admin-supplies-add-input"
                                    value={item.unitPrice}
                                    onChange={event => updateItem(index, 'unitPrice', event.target.value)}
                                    aria-label="Ціна за одиницю"
                                />

                                <Operator>=</Operator>

                                <input
                                    type="text"
                                    className="admin-supplies-add-input admin-supplies-add-input-readonly"
                                    value={formatMoney(resolvedItem.amountWithoutTax)}
                                    readOnly
                                    aria-label="Сума без податку"
                                />

                                <Operator>×</Operator>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    className="admin-supplies-add-input"
                                    value={item.tax}
                                    onChange={event => updateItem(index, 'tax', event.target.value)}
                                    aria-label="Податок"
                                />

                                <Operator>=</Operator>

                                <input
                                    type="text"
                                    className="admin-supplies-add-input admin-supplies-add-input-readonly"
                                    value={formatMoney(resolvedItem.totalAmount)}
                                    readOnly
                                    aria-label="Загальна сума"
                                />

                                <button
                                    type="button"
                                    className="admin-supplies-add-remove"
                                    onClick={() => removeItem(index)}
                                    aria-label="Видалити рядок"
                                >
                                    <TrashIcon />
                                </button>
                            </div>
                        );
                    })}

                    <button type="button" className="admin-supplies-add-more" onClick={addItem}>
                        <span aria-hidden="true">+</span>
                        <span>Додати ще</span>
                    </button>
                </div>

                <div className="admin-supplies-add-submit-wrap">
                    <button type="submit" className="admin-supplies-add-submit" disabled={isSaving}>
                        {isSaving ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSuppliesAdd;
