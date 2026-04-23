import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import Breadcrumb from '../components/Breadcrumb';
import './RegisterPage.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [agreed, setAgreed] = useState(false);
  const [findOrders, setFindOrders] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Базова валідація
    if (password !== confirmPassword) {
      alert('Паролі не збігаються!');
      return;
    }
    if (!agreed) {
      alert('Ви повинні прийняти умови та положення');
      return;
    }

    try {
      // 2. Перевірка, чи не зайнятий імейл
      const checkRes = await fetch(`http://localhost:3001/users?email=${email}`);
      const existingUsers = await checkRes.json();
      
      if (existingUsers.length > 0) {
        alert('Користувач з таким e-mail вже існує!');
        return;
      }

      // 3. Створення нового об'єкта юзера
      const newUser = {
        name,
        email,
        password, // В реальних проектах паролі хешують, але для json-server поки так
        role: 'user',
        subscribe: subscribe,
        findOrders: findOrders,
        createdAt: new Date().toISOString()
      };

      // 4. Запис у db.json
      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData); // Зберігаємо юзера в контексті (AuthContext + LocalStorage)
        navigate('/');   // Перенаправляємо на головну
      }
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      alert('Сталася помилка на сервері. Спробуйте пізніше.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-main-container">
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Реєстрація' }]} />
      </div>

      <h2 className="login-title">Створити обліковий запис</h2>

      <div className="login-content">
        <div className="login-container register-container-wide">
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="input-group">
              <input type="password" placeholder="Повторити пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <div className="input-group">
              <input type="text" placeholder="Ім'я" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="checkbox-section">
              <label className="checkbox-item">
                <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
                <span className="custom-selector"></span>
                <span className="checkbox-text">Прийняти <a href="/terms">Умови та Положення</a></span>
              </label>

              <label className="checkbox-item">
                <input type="checkbox" checked={findOrders} onChange={() => setFindOrders(!findOrders)} />
                <span className="custom-selector"></span>
                <span className="checkbox-text">Знайти минулі замовлення для цього облікового запису</span>
              </label>

              <label className="checkbox-item">
                <input type="checkbox" checked={subscribe} onChange={() => setSubscribe(!subscribe)} />
                <span className="custom-selector"></span>
                <span className="checkbox-text">Підписатися на наші новини <a href="/news" className="preview-link">Переглянути</a></span>
              </label>
            </div>
            
            {/* Кнопка тепер просто submit, логіка переходу всередині handleSubmit */}
            <button type="submit" className="login-submit-btn">
              Створити обліковий запис
            </button>

            <button type="button" className="cancel-link" onClick={() => navigate('/login')}>
              Скасувати
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;