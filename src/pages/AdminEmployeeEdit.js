import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminBlogEdit.css'; // Використовуй існуючі стилі або додай нові

const AdminEmployeeEdit = () => {
    const { id } = useParams(); // Отримуємо ID, якщо це редагування
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [employee, setEmployee] = useState({
        name: '',
        position: '',
        email: '',
        store: '',
        phone: ''
    });

    useEffect(() => {
        if (isEditing) {
            // Завантажуємо дані для редагування
            fetch(`http://localhost:3001/employees/${id}`)
                .then(res => res.json())
                .then(data => setEmployee(data))
                .catch(err => console.error("Помилка завантаження:", err));
        }
    }, [id, isEditing]);

    const handleSave = async () => {
        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing 
            ? `http://localhost:3001/employees/${id}` 
            : 'http://localhost:3001/employees';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });

        if (res.ok) {
            navigate('/admin/staff'); // Повертаємось до списку
        }
    };

    return (
        <main className="admin-main-content">
            <div className="edit-card-header">
                <button className="back-btn" onClick={() => navigate(-1)}>‹</button>
                <h2>{isEditing ? 'Редагування картки працівника' : 'Додавання працівника'}</h2>
            </div>
            
            <hr className="header-line" />

            <div className="edit-form-container">
                <div className="form-row">
                    <label>Ім’я та прізвище працівника</label>
                    <input 
                        type="text" 
                        placeholder="Ім’я Прізвище" 
                        value={employee.name}
                        onChange={e => setEmployee({...employee, name: e.target.value})}
                    />
                </div>

                <div className="form-row">
                    <label>Посада</label>
                    <input 
                        type="text" 
                        placeholder="Власник" 
                        value={employee.position}
                        onChange={e => setEmployee({...employee, position: e.target.value})}
                    />
                </div>

                <div className="form-row">
                    <label>Ел. пошта</label>
                    <input 
                        type="email" 
                        placeholder="somethin@gmail.com" 
                        value={employee.email}
                        onChange={e => setEmployee({...employee, email: e.target.value})}
                    />
                </div>

                <div className="form-row">
                    <label>Коментар</label>
                    <select 
                        value={employee.store}
                        onChange={e => setEmployee({...employee, store: e.target.value})}
                    >
                        <option value="">Назва магазину</option>
                        <option value="arsen">ТЦ Арсен</option>
                        <option value="vele">ТЦ Велес</option>
                    </select>
                </div>

                <div className="form-row">
                    <label>Телефон</label>
                    <input 
                        type="text" 
                        placeholder="0123456789" 
                        value={employee.phone}
                        onChange={e => setEmployee({...employee, phone: e.target.value})}
                    />
                </div>

                <button className="save-large-btn" onClick={handleSave}>Зберегти</button>
            </div>
        </main>
    );
};

export default AdminEmployeeEdit;