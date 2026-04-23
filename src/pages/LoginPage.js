import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Тимчасово для тестів: 'user' або 'admin'
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Імітація запиту до бази даних
    if (email && password) {
      login({ 
        email: email, 
        role: role // передаємо вибрану роль
      });
      
      // Після логіну перекидаємо на головну (або в адмінку, якщо це адмін)
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      alert('Будь ласка, заповніть всі поля');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Вхід</h2>
        <p className="login-subtitle">Раді бачити вас знову!</p>
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>E-mail</label>
            <input 
              type="email" 
              placeholder="example@mail.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label>Пароль</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {/* Тимчасовий блок для розробки: вибір ролі */}
          <div className="role-selector">
            <label>Увійти як:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">Користувач</option>
              <option value="admin">Адміністратор</option>
            </select>
          </div>

          <button type="submit" className="login-submit-btn">Увійти</button>
        </form>

        <div className="login-footer">
          <span>Немає акаунту?</span>
          <button className="register-link-btn" onClick={() => navigate('/register')}>
            Зареєструватися
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;