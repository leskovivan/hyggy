import React from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.svg';
import './AdminLayout.css';

const warehouseRoutes = [
    '/admin/warehouses',
    '/admin/stock',
    '/admin/supplies',
    '/admin/transfers',
    '/admin/write-offs',
];

const mainLinks = [
    { to: '/admin/products', label: 'Товари', match: 'products' },
    { to: '/admin/stores', label: 'Магазини', match: 'stores' },
    { to: '/admin/employees', label: 'Співробітники', match: 'employees' },
    { to: '/admin/clients', label: 'Клієнти', match: 'clients' },
    { to: '/admin/orders', label: 'Замовлення', match: 'orders' },
    { to: '/admin/blogs', label: 'Блоги', match: 'blogs' },
    { to: '/admin/reviews', label: 'Відгуки', match: 'reviews' },
];

const warehouseLinks = [
    { to: '/admin/warehouses', label: 'Склади' },
    { to: '/admin/stock', label: 'Залишки' },
    { to: '/admin/supplies', label: 'Поставки' },
    { to: '/admin/transfers', label: 'Переміщення' },
    { to: '/admin/write-offs', label: 'Списання' },
];

const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isWarehouseRoute = warehouseRoutes.some((route) => location.pathname.startsWith(route));

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar" aria-label="Адмін-навігація">
                <Link to="/" className="admin-site-card">
                    <img src={logo} alt="HYGGY" className="admin-site-logo" />
                    <span>Перейти на сайт</span>
                </Link>

                <nav className="admin-nav">
                    <NavLink
                        to="/admin/products"
                        className={({ isActive }) => (isActive || location.pathname.includes('products') ? 'admin-nav-link active' : 'admin-nav-link')}
                    >
                        Товари
                    </NavLink>

                    <div className="admin-nav-group">
                        <div className={isWarehouseRoute ? 'admin-nav-group-title active' : 'admin-nav-group-title'}>
                            <span>Склади</span>
                            <span className="admin-nav-chevron" aria-hidden="true">⌄</span>
                        </div>

                        <div className="admin-nav-submenu">
                            {warehouseLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => (isActive ? 'admin-nav-link admin-nav-sublink active' : 'admin-nav-link admin-nav-sublink')}
                                >
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {mainLinks.slice(1).map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) => (isActive || location.pathname.includes(link.match) ? 'admin-nav-link active' : 'admin-nav-link')}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <button type="button" className="admin-logout-btn" onClick={handleLogout}>
                    Вихід
                </button>
            </aside>

            <main className="admin-content-area">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
