import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminEmployees.css';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Завантаження даних працівників
        fetch('http://localhost:3001/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Видалити?")) {
            const res = await fetch(`http://localhost:3001/employees/${id}`, { method: 'DELETE' });
            if (res.ok) setEmployees(prev => prev.filter(e => e.id !== id));
        }
    };

    const filteredEmployees = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        if (!query) return employees;

        return employees.filter(emp => {
            const searchText = [
                emp.name,
                emp.login,
                emp.email,
                emp.pin,
                emp.position,
                emp.lastLogin,
            ].filter(Boolean).join(' ').toLowerCase();

            return searchText.includes(query);
        });
    }, [employees, searchTerm]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <section className="admin-employees-page">
            <header className="admin-employees-header">
                <div className="admin-employees-title-row">
                    <h1>Працівники</h1>
                    <span>{filteredEmployees.length}</span>
                </div>

                <button
                    type="button"
                    className="admin-employees-add"
                    onClick={() => navigate('/admin/employees/add')}
                >
                    Додати
                </button>
            </header>

            <div className="admin-employees-tools">
                <label className="admin-employees-search">
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M10.75 5.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5ZM4 10.75a6.75 6.75 0 1 1 12.05 4.18l3.51 3.51-1.06 1.06-3.51-3.51A6.75 6.75 0 0 1 4 10.75Z" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Швидкий пошук"
                        value={searchTerm}
                        onChange={event => setSearchTerm(event.target.value)}
                    />
                </label>
            </div>

            <div className="admin-employees-table-wrap">
                <table className="admin-employees-table">
                    <thead>
                        <tr>
                            <th>
                                <span className="admin-employees-sort">Ім’я</span>
                            </th>
                            <th>Логін</th>
                            <th>Пін-код</th>
                            <th>Посада</th>
                            <th>Дата останнього входу</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map(emp => (
                            <tr key={emp.id}>
                                <td>{emp.name || '—'}</td>
                                <td>{emp.login || emp.email || '—'}</td>
                                <td>{emp.pin || '—'}</td>
                                <td>{emp.position || '—'}</td>
                                <td>{emp.lastLogin || '—'}</td>
                                <td className="admin-employees-actions">
                                    <button
                                        type="button"
                                        className="admin-employees-icon-btn"
                                        onClick={() => navigate(`/admin/employees/edit/${emp.id}`)}
                                        aria-label="Редагувати працівника"
                                    >
                                        <svg aria-hidden="true" viewBox="0 0 24 24">
                                            <path d="M5 19h1.42l9.27-9.27-1.42-1.42L5 17.58V19Zm-2 2v-4.25L15.69 4.06a2 2 0 0 1 2.83 0l1.42 1.42a2 2 0 0 1 0 2.83L7.25 21H3Zm12.35-11.35-1-1 1.42 1.42-.42-.42Z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        className="admin-employees-icon-btn"
                                        onClick={() => handleDelete(emp.id)}
                                        aria-label="Видалити працівника"
                                    >
                                        <svg aria-hidden="true" viewBox="0 0 24 24">
                                            <path d="M7 21a2 2 0 0 1-2-2V7H4V5h5V4h6v1h5v2h-1v12a2 2 0 0 1-2 2H7ZM7 7v12h10V7H7Zm2 10h2V9H9v8Zm4 0h2V9h-2v8Z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminEmployees;
