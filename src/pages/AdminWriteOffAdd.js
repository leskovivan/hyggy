import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './AdminWriteOffAdd.css';

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
    details: '',
});

const packingOptions = ['шт', 'упаковка', 'комплект'];
const reasonOptions = ['Без причини', 'Пошкодження', 'Брак', 'Списання за терміном'];

const TrashIcon = () => (
    <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 21c-.6 0-1.1-.2-1.5-.6S5 19.6 5 19V8H4V6h5V5c0-.6.2-1.1.6-1.5S10.4 3 11 3h2c.6 0 1.1.2 1.5.6S15 4.4 15 5v1h5v2h-1v11c0 .6-.2 1.1-.6 1.5s-.9.6-1.5.6H7ZM17 8H7v11h10V8Zm-6-2h2V5h-2v1Zm-2 11h1.8v-7H9v7Zm4.2 0H15v-7h-1.8v7Z" />
    </svg>
);

const AdminWriteOffAdd = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const now = useMemo(() => new Date(), []);

    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [date, setDate] = useState(formatDateInput(now));
    const [dateDisplay, setDateDisplay] = useState(formatDateLabel(formatDateInput(now)));
    const [hour, setHour] = useState(pad(now.getHours()));
    const [minute, setMinute] = useState(pad(now.getMinutes()));
    const [warehouse, setWarehouse] = useState('');
    const [reason, setReason] = useState('Без причини');
    const [comment, setComment] = useState('');
    const [items, setItems] = useState([createItem(), createItem()]);
    const [existingWriteOff, setExistingWriteOff] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/warehouses').then(res => res.json()),
            fetch('http://localhost:3001/products').then(res => res.json()),
            fetch('http://localhost:3001/employees').then(res => res.json()),
            isEditMode ? fetch(`http://localhost:3001/write-offs/${id}`).then(res => res.json()) : Promise.resolve(null),
        ])
            .then(([warehousesData, productsData, employeesData, writeOffData]) => {
                const safeWarehouses = Array.isArray(warehousesData) ? warehousesData : [];
                const safeProducts = Array.isArray(productsData) ? productsData : [];
                const safeEmployees = Array.isArray(employeesData) ? employeesData : [];

                setWarehouses(safeWarehouses);
                setProducts(safeProducts);
                setEmployees(safeEmployees);
                setWarehouse(prev => prev || writeOffData?.warehouse || safeWarehouses[0]?.name || safeWarehouses[0]?.id || '');

                if (writeOffData && !writeOffData.status) {
                    setExistingWriteOff(writeOffData);
                    setWarehouse(writeOffData.warehouse || '');
                    setReason(writeOffData.reason || 'Без причини');
                    setComment(writeOffData.comment || '');

                    const parsedDate = new Date(writeOffData.date || writeOffData.createdAt || '');
                    if (!Number.isNaN(parsedDate.getTime())) {
                        const nextDate = formatDateInput(parsedDate);
                        setDate(nextDate);
                        setDateDisplay(formatDateLabel(nextDate));
                        setHour(pad(parsedDate.getHours()));
                        setMinute(pad(parsedDate.getMinutes()));
                    }

                    const sourceItems = Array.isArray(writeOffData.items) && writeOffData.items.length
                        ? writeOffData.items
                        : writeOffData.products || [];

                    setItems(sourceItems.length ? sourceItems.map(item => ({
                        productId: String(item.productId || item.id || ''),
                        packing: item.packing || item.packaging || '',
                        quantity: item.quantity ? String(item.quantity) : '',
                        details: item.details || '',
                    })) : [createItem(), createItem()]);
                }
            })
            .catch(error => {
                console.error('Помилка завантаження даних для списання:', error);
            });
    }, [id, isEditMode]);

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

    const addItem = () => {
        setItems(prevItems => [...prevItems, createItem()]);
    };

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
            details: item.details || '',
            unitPrice,
            lineAmount: unitPrice * quantity,
        };
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const parsedDate = parseDateLabel(dateDisplay) || date;
        const normalizedItems = items
            .map(resolveItem)
            .filter(item => item.productId && item.quantity > 0);

        if (!warehouse) {
            alert('Оберіть склад');
            return;
        }

        if (!normalizedItems.length) {
            alert('Додайте хоча б один товар з кількістю більше 0');
            return;
        }

        const amount = normalizedItems.reduce((sum, item) => sum + item.lineAmount, 0);
        const employeeName = employees[0]?.name || employees[0]?.login || 'Адміністратор';

        const payload = {
            ...(existingWriteOff || {}),
            id: isEditMode ? id : String(Date.now()),
            date: `${parsedDate}T${pad(hour)}:${pad(minute)}:00`,
            warehouse,
            reason,
            comment,
            employee: existingWriteOff?.employee || employeeName,
            amount: Math.round(amount * 100) / 100,
            productName: normalizedItems.map(item => item.productName).join(', '),
            items: normalizedItems,
            products: normalizedItems.map(item => ({
                id: item.productId,
                name: item.productName,
                quantity: item.quantity,
                packing: item.packing,
                details: item.details,
            })),
        };

        setIsSaving(true);

        try {
            const response = await fetch(isEditMode ? `http://localhost:3001/write-offs/${id}` : 'http://localhost:3001/write-offs', {
                method: isEditMode ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не вдалося зберегти списання');
            }

            navigate('/admin/write-offs');
        } catch (error) {
            console.error('Помилка збереження списання:', error);
            alert('Не вдалося зберегти списання');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-writeoff-add-page">
            <div className="admin-writeoff-add-header">
                <button
                    type="button"
                    className="admin-writeoff-add-back"
                    onClick={() => navigate('/admin/write-offs')}
                    aria-label="Повернутися до списань"
                >
                    <span className="admin-writeoff-add-back-icon">‹</span>
                    <span>{isEditMode ? 'Редагування списання' : 'Додавання списання'}</span>
                </button>
            </div>

            <form className="admin-writeoff-add-form" onSubmit={handleSubmit}>
                <div className="admin-writeoff-add-main">
                    <div className="admin-writeoff-add-field">
                        <label className="admin-writeoff-add-label" htmlFor="writeoff-date">Дата та час списання</label>
                        <div className="admin-writeoff-add-date-time">
                            <input
                                id="writeoff-date"
                                type="text"
                                className="admin-writeoff-add-input admin-writeoff-add-date"
                                value={dateDisplay}
                                onChange={event => updateDateDisplay(event.target.value)}
                                onBlur={() => setDateDisplay(formatDateLabel(parseDateLabel(dateDisplay) || date))}
                                inputMode="numeric"
                            />
                            <input
                                type="number"
                                min="0"
                                max="23"
                                className="admin-writeoff-add-input admin-writeoff-add-time"
                                value={hour}
                                onChange={event => updateTime(setHour, 23)(event.target.value)}
                                aria-label="Година"
                            />
                            <span className="admin-writeoff-add-separator">:</span>
                            <input
                                type="number"
                                min="0"
                                max="59"
                                className="admin-writeoff-add-input admin-writeoff-add-time"
                                value={minute}
                                onChange={event => updateTime(setMinute, 59)(event.target.value)}
                                aria-label="Хвилина"
                            />
                        </div>
                    </div>

                    <div className="admin-writeoff-add-field">
                        <label className="admin-writeoff-add-label" htmlFor="writeoff-warehouse">Склад</label>
                        <select
                            id="writeoff-warehouse"
                            className="admin-writeoff-add-input admin-writeoff-add-select"
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

                    <div className="admin-writeoff-add-field">
                        <label className="admin-writeoff-add-label" htmlFor="writeoff-reason">Причина</label>
                        <select
                            id="writeoff-reason"
                            className="admin-writeoff-add-input admin-writeoff-add-select"
                            value={reason}
                            onChange={event => setReason(event.target.value)}
                        >
                            {reasonOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-writeoff-add-field admin-writeoff-add-field-top">
                        <label className="admin-writeoff-add-label" htmlFor="writeoff-comment">Коментар</label>
                        <textarea
                            id="writeoff-comment"
                            className="admin-writeoff-add-input admin-writeoff-add-textarea"
                            placeholder="Введіть текст..."
                            value={comment}
                            onChange={event => setComment(event.target.value)}
                        />
                    </div>
                </div>

                <div className="admin-writeoff-add-products">
                    <div className="admin-writeoff-add-products-head">
                        <span>Найменування</span>
                        <span>Фасування</span>
                        <span>Кількість</span>
                        <span>Деталі</span>
                        <span></span>
                    </div>

                    {items.map((item, index) => (
                        <div className="admin-writeoff-add-product-row" key={`${index}-${item.productId || 'empty'}`}>
                            <select
                                className="admin-writeoff-add-input admin-writeoff-add-select"
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
                                className="admin-writeoff-add-input admin-writeoff-add-select"
                                value={item.packing}
                                onChange={event => updateItem(index, 'packing', event.target.value)}
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
                                className="admin-writeoff-add-input"
                                value={item.quantity}
                                onChange={event => updateItem(index, 'quantity', event.target.value)}
                                aria-label="Кількість"
                            />

                            <input
                                type="text"
                                className="admin-writeoff-add-input"
                                value={item.details}
                                onChange={event => updateItem(index, 'details', event.target.value)}
                                aria-label="Деталі"
                            />

                            <button
                                type="button"
                                className="admin-writeoff-add-remove"
                                onClick={() => removeItem(index)}
                                aria-label="Видалити рядок"
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))}

                    <button type="button" className="admin-writeoff-add-more" onClick={addItem}>
                        <span aria-hidden="true">+</span>
                        <span>Додати ще</span>
                    </button>
                </div>

                <div className="admin-writeoff-add-submit-wrap">
                    <button type="submit" className="admin-writeoff-add-submit" disabled={isSaving}>
                        {isSaving ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminWriteOffAdd;
