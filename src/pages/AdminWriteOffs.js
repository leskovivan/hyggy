import React, { useState, useEffect } from 'react';

import AdminToolbar from '../components/AdminToolbar';

const AdminWriteOffs = () => {
    const [writeOffs, setWriteOffs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch('http://localhost:3001/write-offs').then(res => res.json()).then(setWriteOffs);
    }, []);

    return (
        <div className="admin-layout">

            <main className="admin-main-content">
                <AdminToolbar title="Списання" count={writeOffs.length} searchTerm={searchTerm} onSearchChange={setSearchTerm}>
                    <div className="filter-item">Склади ⌄</div>
                    <div className="filter-item">Категорії ⌄</div>
                    <div className="filter-item">Причина ⌄</div>
                </AdminToolbar>
                <div className="table-wrapper">
                    <table className="admin-order-table">
                        <thead>
                            <tr>
                                <th>№</th>
                                <th>Дата ⌄</th>
                                <th>Працівник</th>
                                <th>Склад</th>
                                <th>Товари</th>
                                <th>Причина</th>
                                <th>Сума</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Map по списаннях */}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminWriteOffs;