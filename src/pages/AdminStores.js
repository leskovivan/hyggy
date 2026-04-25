import React, { useState, useEffect, useMemo } from 'react';
// Додаємо імпорт Sidebar, який ти виніс раніше

import AdminToolbar from '../components/AdminToolbar';
import './AdminBlogEdit.css';

const AdminStores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Дефолтний об'єкт графіка, щоб уникнути помилок в Header
    const defaultSchedule = {
        mon: { start: "10:00", end: "19:00" },
        tue: { start: "10:00", end: "19:00" },
        wed: { start: "10:00", end: "19:00" },
        thu: { start: "10:00", end: "19:00" },
        fri: { start: "10:00", end: "19:00" },
        sat: { start: "10:00", end: "19:00" },
        sun: { start: "10:00", end: "19:00" }
    };

    const [currentStore, setCurrentStore] = useState({
        name: '',
        city: '',
        address: '',
        warehouse: 'Загальний склад',
        image: '',
        schedule: defaultSchedule,
        totalProductsSum: 1650 
    });

    useEffect(() => {
        fetch('http://localhost:3001/stores')
            .then(res => res.json())
            .then(data => {
                setStores(data);
                setLoading(false);
            })
            .catch(err => console.error("Помилка:", err));
    }, []);

    const parseAddress = (fullAddress) => {
        if (!fullAddress) return { street: '—', building: '—' };
        const parts = fullAddress.split(' ');
        const building = parts.pop(); 
        const street = parts.join(' '); 
        return { street, building };
    };

    const handleEditClick = (store) => {
        // Перевіряємо, чи є в магазині графік, якщо ні — ставимо дефолтний
        setCurrentStore({
            ...store,
            schedule: store.schedule && Object.keys(store.schedule).length > 0 
                      ? store.schedule 
                      : defaultSchedule
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing 
            ? `http://localhost:3001/stores/${currentStore.id}` 
            : 'http://localhost:3001/stores';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentStore) 
        });

        if (res.ok) {
            const saved = await res.json();
            setStores(prev => isEditing ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved]);
            setIsModalOpen(false);
        }
    };

    const filteredStores = useMemo(() => {
        return stores.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [stores, searchTerm]);

    if (loading) return <div className="admin-loading">Завантаження...</div>;

    return (
        <div className="admin-layout">


            <main className="admin-main-content">
                <AdminToolbar 
                    title="Магазини" 
                    count={filteredStores.length}
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onAdd={() => {
                        setIsEditing(false);
                        setCurrentStore({ 
                            name: '', 
                            city: '', 
                            address: '', 
                            warehouse: 'Загальний склад', 
                            image: '',
                            schedule: defaultSchedule
                        });
                        setIsModalOpen(true);
                    }} 
                />

                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Назва ⌄</th>
                                <th>Вулиця</th>
                                <th>№ будинку</th>
                                <th>Заг. сума товарів</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStores.map((store, idx) => {
                                const { street, building } = parseAddress(store.address);
                                return (
                                    <tr key={store.id}>
                                        <td>{idx + 1}</td>
                                        <td>{store.name}</td>
                                        <td>{street}</td>
                                        <td>{building}</td>
                                        <td>{store.totalProductsSum || '1650'}₴</td>
                                        <td className="table-actions">
                                            <button className="edit-action-btn" onClick={() => handleEditClick(store)}>📝</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="admin-modal">
                        <h3>{isEditing ? 'Редагувати' : 'Додати'}</h3>
                        <div className="modal-form">
                            <input 
                                placeholder="Назва ТЦ" 
                                value={currentStore.name} 
                                onChange={e => setCurrentStore({...currentStore, name: e.target.value})} 
                            />
                            <input 
                                placeholder="Місто" 
                                value={currentStore.city} 
                                onChange={e => setCurrentStore({...currentStore, city: e.target.value})} 
                            />
                            <input 
                                placeholder="Вулиця та номер (через пробіл)" 
                                value={currentStore.address} 
                                onChange={e => setCurrentStore({...currentStore, address: e.target.value})} 
                            />
                        </div>
                        <div className="modal-buttons">
                            <button className="teal-btn" onClick={handleSave}>Зберегти</button>
                            <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Скасувати</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStores;