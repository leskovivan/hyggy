import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';

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
        return employees.filter(emp => 
            emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.login?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [employees, searchTerm]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-layout">
            <main className="admin-main-content">
                <AdminToolbar 
                    title="Працівники" 
                    count={filteredEmployees.length}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    // Перехід на сторінку додавання
                    onAdd={() => navigate('/admin/employees/add')} 
                />

                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>Ім'я ⌄</th>
                                <th>Логін</th>
                                <th>Пін-код</th>
                                <th>Посада</th>
                                <th>Останній вхід</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id}>
                                    <td>{emp.name}</td>
                                    <td>{emp.login}</td>
                                    <td>{emp.pin}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.lastLogin || '—'}</td>
                                    <td className="table-actions">
                                        <button 
                                            className="edit-action-btn" 
                                            // Перехід на сторінку редагування за ID
                                            onClick={() => navigate(`/admin/employees/edit/${emp.id}`)}
                                        >
                                            📝
                                        </button>
                                        <button 
                                            className="delete-action-btn" 
                                            onClick={() => handleDelete(emp.id)}
                                        >
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminEmployees;