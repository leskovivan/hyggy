import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './AdminWriteOffAdd.css';

const defaultItem = () => ({
    productId: '',
    packing: '',
    quantity: '',
    details: '',
});

const packingOptions = ['шт', 'упаковка', 'комплект'];
const reasonOptions = ['Без причини', 'Пошкодження', 'Брак', 'Списання за терміном'];

const pad = (value) => String(value).padStart(2, '0');

const AdminWriteOffAdd = () => {
    const navigate = useNavigate();

    const now = useMemo(() => new Date(), []);

    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [date, setDate] = useState(now.toISOString().slice(0, 10));
    const [hour, setHour] = useState(pad(now.getHours()));
    const [minute, setMinute] = useState(pad(now.getMinutes()));
    const [warehouse, setWarehouse] = useState('');
    const [reason, setReason] = useState('Без причини');
    const [comment, setComment] = useState('');
    const [items, setItems] = useState([defaultItem(), defaultItem()]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3001/warehouses').then(res => res.json()),
            fetch('http://localhost:3001/products').then(res => res.json()),
            fetch('http://localhost:3001/employees').then(res => res.json()),
        ])
            .then(([warehousesData, productsData, employeesData]) => {
                setWarehouses(warehousesData || []);
                setProducts(productsData || []);
                setEmployees(employeesData || []);

                if (warehousesData?.length) {
                    setWarehouse(warehousesData[0].name || String(warehousesData[0].id));
                }
            })
            .catch(err => console.error('Помилка завантаження даних для списання:', err));
    }, []);

    const productById = useMemo(() => {
        const map = new Map();
        products.forEach(product => map.set(String(product.id), product));
        return map;
    }, [products]);

    const updateItem = (index, field, value) => {
        setItems(prev => prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item)));
    };

    const addItem = () => setItems(prev => [...prev, defaultItem()]);

    const removeItem = (index) => {
        setItems(prev => {
            if (prev.length === 1) return prev;
            return prev.filter((_, idx) => idx !== index);
        });
    };

    const handleSave = async () => {
        const normalizedItems = items
            .filter(item => item.productId && Number(item.quantity) > 0)
            .map(item => {
                const product = productById.get(String(item.productId));
                const unitPrice = Number(product?.price || 0);
                const quantity = Number(item.quantity || 0);

                return {
                    productId: String(item.productId),
                    productName: product?.name || '—',
                    packing: item.packing || 'шт',
                    quantity,
                    details: item.details || '',
                    unitPrice,
                    lineAmount: unitPrice * quantity,
                };
            });

        if (!warehouse) {
            alert('Оберіть склад');
            return;
        }

        if (!normalizedItems.length) {
            alert('Додайте хоча б один товар з кількістю більше 0');
            return;
        }

        const employeeName = employees?.[0]?.name || 'Ім’я';
        const amount = normalizedItems.reduce((sum, item) => sum + item.lineAmount, 0);
        const dateTime = `${date}T${pad(hour)}:${pad(minute)}:00`;

        const payload = {
            id: Date.now().toString(),
            date: dateTime,
            warehouse,
            reason,
            comment,
            employee: employeeName,
            amount: Number(amount.toFixed(2)),
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
            const response = await fetch('http://localhost:3001/write-offs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не вдалося зберегти списання');
            }

            navigate('/admin/write-offs');
        } catch (error) {
            console.error(error);
            alert('Помилка збереження списання');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="admin-writeoff-add-container">
            <div className="admin-writeoff-add-header">
                <button
                    type="button"
                    className="admin-writeoff-add-back"
                    onClick={() => navigate('/admin/write-offs')}
                    aria-label="Повернутися до списку списань"
                >
                    <span className="admin-writeoff-add-back-icon">&lsaquo;</span>
                    <span>Додавання списання</span>
                </button>
            </div>

            <div className="admin-writeoff-add-main-form">
                <div className="admin-writeoff-add-row">
                    <label className="admin-writeoff-add-label">Дата та час списання</label>
                    <div className="admin-writeoff-add-date-time">
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="admin-writeoff-input admin-writeoff-input-date" />
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={hour}
                            onChange={e => setHour(pad(Math.max(0, Math.min(23, Number(e.target.value || 0)))))}
                            className="admin-writeoff-input admin-writeoff-input-time"
                        />
                        <span className="admin-writeoff-time-separator">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={minute}
                            onChange={e => setMinute(pad(Math.max(0, Math.min(59, Number(e.target.value || 0)))))}
                            className="admin-writeoff-input admin-writeoff-input-time"
                        />
                    </div>
                </div>

                <div className="admin-writeoff-add-row">
                    <label className="admin-writeoff-add-label">Склад</label>
                    <select className="admin-writeoff-input admin-writeoff-select" value={warehouse} onChange={e => setWarehouse(e.target.value)}>
                        {warehouses.map(item => (
                            <option key={item.id} value={item.name || String(item.id)}>
                                {item.name || `Склад ${item.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="admin-writeoff-add-row">
                    <label className="admin-writeoff-add-label">Причина</label>
                    <select className="admin-writeoff-input admin-writeoff-select" value={reason} onChange={e => setReason(e.target.value)}>
                        {reasonOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>

                <div className="admin-writeoff-add-row admin-writeoff-add-row-top">
                    <label className="admin-writeoff-add-label">Коментар</label>
                    <textarea
                        className="admin-writeoff-input admin-writeoff-textarea"
                        placeholder="Введіть текст..."
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                    />
                </div>
            </div>

            <div className="admin-writeoff-add-items">
                <div className="admin-writeoff-add-items-head">
                    <span>Найменування</span>
                    <span>Фасування</span>
                    <span>Кількість</span>
                    <span>Деталі</span>
                    <span></span>
                </div>

                {items.map((item, index) => (
                    <div className="admin-writeoff-add-item-row" key={`${index}-${item.productId}`}>
                        <select
                            className="admin-writeoff-input admin-writeoff-select"
                            value={item.productId}
                            onChange={e => updateItem(index, 'productId', e.target.value)}
                        >
                            <option value="">Виберіть...</option>
                            {products.map(product => (
                                <option key={product.id} value={String(product.id)}>{product.name}</option>
                            ))}
                        </select>

                        <select
                            className="admin-writeoff-input admin-writeoff-select"
                            value={item.packing}
                            onChange={e => updateItem(index, 'packing', e.target.value)}
                        >
                            <option value="">Виберіть...</option>
                            {packingOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="0"
                            className="admin-writeoff-input"
                            value={item.quantity}
                            onChange={e => updateItem(index, 'quantity', e.target.value)}
                        />

                        <input
                            type="text"
                            className="admin-writeoff-input"
                            value={item.details}
                            onChange={e => updateItem(index, 'details', e.target.value)}
                        />

                        <button
                            type="button"
                            className="admin-writeoff-remove-row"
                            onClick={() => removeItem(index)}
                            title="Видалити рядок"
                            aria-label="Видалити рядок"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M4 7H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                <path d="M9.5 3H14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                                <path d="M18.5 7L17.8 18.2C17.74 19.24 16.88 20.05 15.84 20.05H8.16C7.12 20.05 6.26 19.24 6.2 18.2L5.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                ))}

                <button type="button" className="admin-writeoff-add-more" onClick={addItem}>
                    <span>+</span>
                    <span>Додати ще</span>
                </button>
            </div>

            <div className="admin-writeoff-add-actions">
                <button type="button" className="admin-writeoff-save-btn" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Збереження...' : 'Зберегти'}
                </button>
            </div>
        </div>
    );
};

export default AdminWriteOffAdd;
