import React from 'react';
import './AdminToolbar.css';

const AdminToolbar = ({ title, count, searchTerm, onSearchChange, onAdd, children }) => {
    return (
        <div className="admin-toolbar">
            <div className="toolbar-header">
                <h2 className="toolbar-title">
                    {title} <span className="toolbar-count">{count}</span>
                </h2>
                {onAdd && (
                    <button className="add-button" onClick={onAdd}>Додати</button>
                )}
            </div>
            
            <div className="toolbar-actions">
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input 
                        type="text" 
                        className="search-input"
                        placeholder="Швидкий пошук" 
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)} // Оновлюємо пошук у батьківському компоненті
                    />
                </div>
                
                <div className="filter-group">
                    {/* Сюди ми прокинемо випадаючі списки з AdminOrders */}
                    {children}
                    <div className="filter-item filter-plus" onClick={() => alert("Додаткові фільтри в розробці")}>
                        Фільтр +
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminToolbar;