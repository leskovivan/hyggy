import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import './LoginPage.css';
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Паролі не збігаються!');
      return;
    }

    if (!agreed) {
      alert('Ви повинні прийняти умови та положення');
      return;
    }

    try {
      const checkResponse = await fetch(`http://localhost:3001/users?email=${email}`);
      const existingUsers = await checkResponse.json();

      if (existingUsers.length > 0) {
        alert('Користувач з таким e-mail вже існує!');
        return;
      }

      const newUser = {
        name,
        email,
        password,
        role: 'user',
        subscribe,
        findOrders,
        favorites: [],
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData);
        navigate('/confirm');
      }
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      alert('Сталася помилка на сервері. Спробуйте пізніше.');
    }
  };

  return (
    <main className="auth-page auth-page--register">
      <div className="auth-page__container">
        <Breadcrumb items={[
          { label: 'Домашня сторінка', path: '/' },
          { label: 'Моя сторінка', path: '/profile' },
          { label: 'Створити обліковий запис' },
        ]} />

        <header className="auth-heading">
          <h1>Створити обліковий запис</h1>
        </header>

        <section className="auth-panel" aria-label="Створити обліковий запис">
          <form className="auth-form register-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Повторити пароль"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Ім’я"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <div className="checkbox-section">
              <label className="checkbox-item">
                <input type="checkbox" checked={agreed} onChange={() => setAgreed((value) => !value)} />
                <span className="custom-selector" />
                <span className="checkbox-text">Прийняти <a href="/terms">Умови та Положення</a></span>
              </label>

              <label className="checkbox-item">
                <input type="checkbox" checked={findOrders} onChange={() => setFindOrders((value) => !value)} />
                <span className="custom-selector" />
                <span className="checkbox-text">Знайти минулі замовлення для цього облікового запису</span>
              </label>

              <label className="checkbox-item">
                <input type="checkbox" checked={subscribe} onChange={() => setSubscribe((value) => !value)} />
                <span className="custom-selector" />
                <span className="checkbox-text">Підписатися на наші новини <a href="/news" className="preview-link">Переглянути</a></span>
              </label>
            </div>

            <button type="submit" className="auth-primary-btn">Створити обліковий запис</button>

            <button type="button" className="auth-link" onClick={() => navigate('/login')}>
              Скасувати
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default RegisterPage;
