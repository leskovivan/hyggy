import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import './AdminWarehouseEdit.css';

const API_URL = 'http://localhost:3001/warehouses';

const createEmptyWarehouse = () => ({
    name: '',
    address: '',
    totalSum: 0,
});

const AdminWarehouseEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [warehouse, setWarehouse] = useState(createEmptyWarehouse);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isEditing) {
            return;
        }

        fetch(`${API_URL}/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Не вдалося знайти склад');
                }

                return res.json();
            })
            .then(data => setWarehouse({ ...createEmptyWarehouse(), ...data }))
            .catch(error => {
                console.error('Помилка завантаження складу:', error);
                alert('Не вдалося завантажити склад');
                navigate('/admin/warehouses');
            });
    }, [id, isEditing, navigate]);

    const updateField = (field, value) => {
        setWarehouse(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!warehouse.name.trim()) {
            alert('Введіть назву складу');
            return;
        }

        if (!warehouse.address.trim()) {
            alert('Введіть адресу складу');
            return;
        }

        const payload = {
            ...warehouse,
            id: isEditing ? String(id) : String(Date.now()),
            totalSum: Number(warehouse.totalSum || 0),
        };

        setIsSaving(true);

        try {
            const response = await fetch(`${API_URL}${isEditing ? `/${id}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Не вдалося зберегти склад');
            }

            navigate('/admin/warehouses');
        } catch (error) {
            console.error('Помилка збереження складу:', error);
            alert('Не вдалося зберегти склад');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="admin-warehouse-edit-page">
            <button
                type="button"
                className="admin-warehouse-edit-back"
                onClick={() => navigate('/admin/warehouses')}
            >
                <span aria-hidden="true">‹</span>
                {isEditing ? 'Редагування складу' : 'Додавання складу'}
            </button>

            <form className="admin-warehouse-edit-form" onSubmit={handleSubmit}>
                <label className="admin-warehouse-edit-field">
                    <span>Назва</span>
                    <input
                        type="text"
                        value={warehouse.name}
                        onChange={event => updateField('name', event.target.value)}
                        placeholder="Введіть назву..."
                    />
                </label>

                <label className="admin-warehouse-edit-field">
                    <span>Адреса</span>
                    <input
                        type="text"
                        value={warehouse.address}
                        onChange={event => updateField('address', event.target.value)}
                        placeholder="Введіть адресу..."
                    />
                </label>

                <label className="admin-warehouse-edit-field">
                    <span>Сума</span>
                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={warehouse.totalSum}
                        onChange={event => updateField('totalSum', event.target.value)}
                    />
                </label>

                <button type="submit" className="admin-warehouse-edit-submit" disabled={isSaving}>
                    {isSaving ? 'Збереження...' : 'Зберегти'}
                </button>
            </form>
        </section>
    );
};

export default AdminWarehouseEdit;
