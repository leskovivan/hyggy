import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './AdminStoreEdit.css';

const defaultSchedule = {
    mon: { start: '10:00', end: '19:00' },
    tue: { start: '10:00', end: '19:00' },
    wed: { start: '10:00', end: '19:00' },
    thu: { start: '10:00', end: '19:00' },
    fri: { start: '10:00', end: '19:00' },
    sat: { start: '10:00', end: '19:00' },
    sun: { start: '10:00', end: '19:00' },
};

const days = [
    { key: 'mon', label: 'ПН:' },
    { key: 'tue', label: 'ВТ:' },
    { key: 'wed', label: 'СР:' },
    { key: 'thu', label: 'ЧТ:' },
    { key: 'fri', label: 'ПТ:' },
    { key: 'sat', label: 'СБ:' },
    { key: 'sun', label: 'НД:' },
];

const createEmptyStore = () => ({
    name: '',
    city: '',
    address: '',
    warehouse: 'Загальний склад',
    image: '',
    schedule: defaultSchedule,
    totalProductsSum: 1650,
});

const AdminStoreEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [store, setStore] = useState(createEmptyStore);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/warehouses')
            .then(res => res.json())
            .then(data => {
                const safeWarehouses = Array.isArray(data) ? data : [];
                setWarehouses(safeWarehouses);

                if (!isEditing && safeWarehouses[0]?.name) {
                    setStore(prev => ({ ...prev, warehouse: prev.warehouse || safeWarehouses[0].name }));
                }
            })
            .catch(error => console.error('Помилка завантаження складів:', error));
    }, [isEditing]);

    useEffect(() => {
        if (!isEditing) return;

        fetch(`http://localhost:3001/stores/${id}`)
            .then(res => res.json())
            .then(data => {
                setStore({
                    ...createEmptyStore(),
                    ...data,
                    schedule: {
                        ...defaultSchedule,
                        ...(data.schedule || {}),
                    },
                });
                setLoading(false);
            })
            .catch(error => {
                console.error('Помилка завантаження магазину:', error);
                setLoading(false);
            });
    }, [id, isEditing]);

    const currentAddress = useMemo(() => {
        const parts = [store.address, store.city].filter(Boolean);
        return parts.length ? parts.join(', ') : '—';
    }, [store.address, store.city]);

    const updateField = (field, value) => {
        setStore(prev => ({ ...prev, [field]: value }));
    };

    const updateSchedule = (dayKey, field, value) => {
        setStore(prev => ({
            ...prev,
            schedule: {
                ...prev.schedule,
                [dayKey]: {
                    ...prev.schedule[dayKey],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!store.name.trim()) {
            alert('Введіть назву магазину');
            return;
        }

        if (!store.address.trim()) {
            alert('Введіть адресу магазину');
            return;
        }

        const selectedWarehouse = warehouses.find(item => item.name === store.warehouse);
        const payload = {
            ...store,
            id: isEditing ? store.id : String(Date.now()),
            city: store.city.trim(),
            name: store.name.trim(),
            address: store.address.trim(),
            warehouse: store.warehouse || selectedWarehouse?.name || 'Загальний склад',
            totalProductsSum: Number(store.totalProductsSum || selectedWarehouse?.totalSum || 1650),
        };

        setIsSaving(true);
        try {
            const response = await fetch(isEditing ? `http://localhost:3001/stores/${id}` : 'http://localhost:3001/stores', {
                method: isEditing ? 'PATCH' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не вдалося зберегти магазин');
            }

            navigate('/admin/stores');
        } catch (error) {
            console.error('Помилка збереження магазину:', error);
            alert('Не вдалося зберегти магазин');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-store-edit-page">
            <div className="admin-store-edit-header">
                <button
                    type="button"
                    className="admin-store-edit-back"
                    onClick={() => navigate('/admin/stores')}
                    aria-label="Повернутися до магазинів"
                >
                    <span className="admin-store-edit-back-icon">‹</span>
                    <span>{isEditing ? 'Редагування магазину' : 'Додавання магазину'}</span>
                </button>
            </div>

            <div className="admin-store-edit-divider" />

            <form className="admin-store-edit-form" onSubmit={handleSubmit}>
                <div className="admin-store-edit-field">
                    <label className="admin-store-edit-label" htmlFor="store-name">Назва магазину:</label>
                    <input
                        id="store-name"
                        className="admin-store-edit-input"
                        type="text"
                        value={store.name}
                        onChange={event => updateField('name', event.target.value)}
                    />
                </div>

                <div className="admin-store-edit-field">
                    <label className="admin-store-edit-label" htmlFor="store-address">Адреса магазину:</label>
                    <input
                        id="store-address"
                        className="admin-store-edit-input"
                        type="text"
                        placeholder="Північний бульвар 2а"
                        value={store.address}
                        onChange={event => updateField('address', event.target.value)}
                    />
                </div>

                <div className="admin-store-edit-field">
                    <label className="admin-store-edit-label" htmlFor="store-city">Місто:</label>
                    <input
                        id="store-city"
                        className="admin-store-edit-input"
                        type="text"
                        placeholder="Івано-Франківськ"
                        value={store.city}
                        onChange={event => updateField('city', event.target.value)}
                    />
                </div>

                <p className="admin-store-edit-current">Поточна адреса: {currentAddress}</p>

                <div className="admin-store-edit-field">
                    <label className="admin-store-edit-label" htmlFor="store-warehouse">Склад магазину:</label>
                    <select
                        id="store-warehouse"
                        className="admin-store-edit-input admin-store-edit-select"
                        value={store.warehouse}
                        onChange={event => updateField('warehouse', event.target.value)}
                    >
                        <option value="">Оберіть склад</option>
                        {warehouses.map(item => (
                            <option key={item.id} value={item.name || String(item.id)}>
                                {item.name || `Склад ${item.id}`}
                            </option>
                        ))}
                    </select>
                </div>

                <section className="admin-store-edit-hours" aria-labelledby="store-hours-title">
                    <h3 id="store-hours-title">Робочі години:</h3>

                    {days.map(day => (
                        <div className="admin-store-edit-day" key={day.key}>
                            <span className="admin-store-edit-day-label">{day.label}</span>
                            <label className="admin-store-edit-time-label" htmlFor={`${day.key}-start`}>Початок</label>
                            <input
                                id={`${day.key}-start`}
                                className="admin-store-edit-time"
                                type="time"
                                value={store.schedule[day.key]?.start || defaultSchedule[day.key].start}
                                onChange={event => updateSchedule(day.key, 'start', event.target.value)}
                            />
                            <label className="admin-store-edit-time-label" htmlFor={`${day.key}-end`}>Кінець</label>
                            <input
                                id={`${day.key}-end`}
                                className="admin-store-edit-time"
                                type="time"
                                value={store.schedule[day.key]?.end || defaultSchedule[day.key].end}
                                onChange={event => updateSchedule(day.key, 'end', event.target.value)}
                            />
                        </div>
                    ))}
                </section>

                <div className="admin-store-edit-submit-wrap">
                    <button type="submit" className="admin-store-edit-submit" disabled={isSaving}>
                        {isSaving ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminStoreEdit;
