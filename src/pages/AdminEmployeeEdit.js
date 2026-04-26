import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminEmployeeEdit.css';

const AdminEmployeeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [employee, setEmployee] = useState({
        name: '',
        position: '',
        login: '',
        store: '',
        phone: '',
        pin: ''
    });
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(isEditing);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetch('http://localhost:3001/stores')
            .then(res => res.json())
            .then(data => {
                const safeStores = Array.isArray(data) ? data : [];
                setStores(safeStores);
            })
            .catch(err => console.error('Помилка завантаження магазинів:', err));
    }, []);

    useEffect(() => {
        if (!isEditing) return;

        fetch(`http://localhost:3001/employees/${id}`)
            .then(res => res.json())
            .then(data => {
                setEmployee({
                    name: data.name || '',
                    position: data.position || '',
                    login: data.login || data.email || '',
                    store: data.store || '',
                    phone: data.phone || '',
                    pin: data.pin || ''
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Помилка завантаження:', err);
                setLoading(false);
            });
    }, [id, isEditing]);

    const updateEmployee = (field, value) => {
        setEmployee(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async (event) => {
        event.preventDefault();

        if (!employee.name.trim()) {
            alert('Введіть ім’я працівника');
            return;
        }

        if (!employee.login.trim()) {
            alert('Введіть ел. пошту працівника');
            return;
        }

        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing 
            ? `http://localhost:3001/employees/${id}` 
            : 'http://localhost:3001/employees';

        const payload = {
            ...employee,
            id: isEditing ? id : String(Date.now()),
            name: employee.name.trim(),
            login: employee.login.trim(),
            email: employee.login.trim(),
            position: employee.position.trim(),
            phone: employee.phone.trim(),
            store: employee.store,
            pin: employee.pin || '111',
            lastLogin: employee.lastLogin || '—'
        };

        setIsSaving(true);
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                throw new Error('Не вдалося зберегти працівника');
            }

            navigate('/admin/employees');
        } catch (error) {
            console.error('Помилка збереження працівника:', error);
            alert('Не вдалося зберегти працівника');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <section className="admin-employee-edit-page">
            <div className="admin-employee-edit-header">
                <button
                    type="button"
                    className="admin-employee-edit-back"
                    onClick={() => navigate('/admin/employees')}
                    aria-label="Повернутися до працівників"
                >
                    <span className="admin-employee-edit-back-icon">‹</span>
                    <span>{isEditing ? 'Редагування картки працівника' : 'Додавання працівника'}</span>
                </button>
            </div>

            <div className="admin-employee-edit-divider" />

            <form className="admin-employee-edit-form" onSubmit={handleSave}>
                <div className="admin-employee-edit-field admin-employee-edit-name-field">
                    <label className="admin-employee-edit-label" htmlFor="employee-name">
                        Ім’я та прізвище працівника
                    </label>
                    <input
                        id="employee-name"
                        className="admin-employee-edit-input admin-employee-edit-name"
                        type="text"
                        placeholder="Ім’я Прізвище"
                        value={employee.name}
                        onChange={event => updateEmployee('name', event.target.value)}
                    />
                </div>

                <div className="admin-employee-edit-field">
                    <label className="admin-employee-edit-label" htmlFor="employee-position">Посада</label>
                    <input
                        id="employee-position"
                        className="admin-employee-edit-input"
                        type="text"
                        placeholder="Власник"
                        value={employee.position}
                        onChange={event => updateEmployee('position', event.target.value)}
                    />
                </div>

                <div className="admin-employee-edit-field">
                    <label className="admin-employee-edit-label" htmlFor="employee-login">Ел. пошта</label>
                    <input
                        id="employee-login"
                        className="admin-employee-edit-input"
                        type="email"
                        placeholder="somethin@gmail.com"
                        value={employee.login}
                        onChange={event => updateEmployee('login', event.target.value)}
                    />
                </div>

                <div className="admin-employee-edit-field">
                    <label className="admin-employee-edit-label" htmlFor="employee-store">Коментар</label>
                    <select
                        id="employee-store"
                        className="admin-employee-edit-input admin-employee-edit-select"
                        value={employee.store}
                        onChange={event => updateEmployee('store', event.target.value)}
                    >
                        <option value="">Назва магазину</option>
                        {stores.map(store => (
                            <option key={store.id} value={store.name}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="admin-employee-edit-field">
                    <label className="admin-employee-edit-label" htmlFor="employee-phone">Телефон</label>
                    <input
                        id="employee-phone"
                        className="admin-employee-edit-input"
                        type="tel"
                        placeholder="01234567890"
                        value={employee.phone}
                        onChange={event => updateEmployee('phone', event.target.value)}
                    />
                </div>

                <div className="admin-employee-edit-submit-wrap">
                    <button type="submit" className="admin-employee-edit-submit" disabled={isSaving}>
                        {isSaving ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AdminEmployeeEdit;
