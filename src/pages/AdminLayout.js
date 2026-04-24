import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Используем твой контекст
import './AdminLayout.css';

const AdminLayout = () => {
    const { logout } = useAuth(); // Берем функцию выхода
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout(); // Очищаем данные юзера через твой контекст
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* БІЧНА ПАНЕЛЬ */}
            <aside className="admin-sidebar">
                <div className="admin-logo-area">
                    <Link to="/" className="to-site-btn">← Перейти на сайт</Link>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin/products" className={location.pathname.includes('products') ? 'active' : ''}>Товари</Link>
                    
                    <div className="nav-group">
                        <span className="nav-group-title">Склади </span>
                        <Link to="/admin/warehouses">Склади</Link>
                        <Link to="/admin/stock">Залишки</Link>
                    </div>

                    <Link to="/admin/stores" className={location.pathname.includes('stores') ? 'active' : ''}>Магазини</Link>
                    <Link to="/admin/employees" className={location.pathname.includes('employees') ? 'active' : ''}>Співробітники</Link>
                    <Link to="/admin/clients" className={location.pathname.includes('clients') ? 'active' : ''}>Клієнти</Link>
                    <Link to="/admin/orders" className={location.pathname.includes('orders') ? 'active' : ''}>Замовлення</Link>
                    
                    <Link to="/admin/blogs" className={location.pathname.includes('blogs') ? 'active' : ''}>Блоги</Link>
                    <Link to="/admin/reviews" className={location.pathname.includes('reviews') ? 'active' : ''}>Відгуки</Link>
                </nav>

                <button className="logout-btn" onClick={handleLogout}>Вихід</button>
            </aside>

            {/* ОСНОВНИЙ КОНТЕНТ */}
            <main className="admin-content-area">
                <Outlet /> 
            </main>
        </div>
    );
};

export default AdminLayout;