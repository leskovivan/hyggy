import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import Breadcrumb from '../components/Breadcrumb';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Запит до бази: шукаємо юзера за імейлом ТА паролем
      const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
      const users = await response.json();

      // 2. Перевірка результату
      if (users.length > 0) {
        const user = users[0];
        
        // 3. Зберігаємо юзера в контекст (AuthContext підхопить і запише в LocalStorage)
        login(user); 
        
        alert(`Вітаємо, ${user.name}!`);
        navigate('/'); // Йдемо на головну
      } else {
        alert('Невірний E-mail або пароль. Спробуйте ще раз.');
      }
    } catch (error) {
      console.error("Помилка при вході:", error);
      alert('Помилка з’єднання з сервером. Перевірте, чи запущений json-server.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-main-container">
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Вхід' }]} />
      </div>

      <h2 className="login-title">Вхід</h2>

      <div className="login-content">
        <div className="login-container">
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Пароль" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button type="submit" className="login-submit-btn">Увійти</button>
            
            {/* Додав перехід на сторінку відновлення */}
            <button 
              type="button" 
              className="forgot-password-link" 
              onClick={() => navigate('/forgot-password')}
            >
              Забули пароль?
            </button>
          </form>

          <div className="register-section">
            <h3 className="register-title">Створити новий обліковий запис</h3>
            
            <ul className="benefits-list">
              <li>Відстежуйте ваші посилки від замовлення до доставки</li>
              <li>Зберігайте історію замовлень</li>
              <li>Додавайте товари до списку бажань</li>
              <li>Зберігайте інформацію для майбутніх покупок</li>
            </ul>

            <button 
              className="create-account-btn" 
              onClick={() => navigate('/register')}
            >
              Створити новий обліковий запис
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;