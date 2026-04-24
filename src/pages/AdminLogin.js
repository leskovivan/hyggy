import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Подключаем твой контекст

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useAuth(); // Берем функцию логина из контекста
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const res = await fetch('http://localhost:3001/users');
            const users = await res.json();
            
            // Ищем админа
            const admin = users.find(u => u.email === email && u.password === password && u.role === 'admin');
            
            if (admin) {
                login(admin); // Обновляем глобальный стейт AuthContext
                
                // Микро-задержка, чтобы ProtectedRoute увидел, что мы уже админ
                setTimeout(() => {
                    navigate('/admin/blogs');
                }, 50);
            } else {
                setError('Невірний логін або пароль');
            }
        } catch (err) {
            setError('Помилка сервера');
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
            <form onSubmit={handleLogin} style={{ background: '#fff', padding: '40px', borderRadius: '8px', width: '350px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: 'Raleway' }}>Адмін-панель</h2>
                {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
                
                <input 
                    type="email" 
                    placeholder="Email (admin@hyggy.com)" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                <input 
                    type="password" 
                    placeholder="Пароль (123)" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
                />
                <button type="submit" style={{ width: '100%', padding: '12px', background: '#00aaad', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>
                    Увійти
                </button>
            </form>
        </div>
    );
};

export default AdminLogin;