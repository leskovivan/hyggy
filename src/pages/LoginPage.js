import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Breadcrumb from '../components/Breadcrumb';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users?email=${email}&password=${password}`);
      const users = await response.json();

      if (users.length > 0) {
        const user = users[0];
        login(user);
        navigate('/');
        return;
      }

      alert('Невірний E-mail або пароль. Спробуйте ще раз.');
    } catch (error) {
      console.error('Помилка при вході:', error);
      alert('Помилка з’єднання з сервером. Перевірте, чи запущений json-server.');
    }
  };

  return (
    <main className="auth-page auth-page--login">
      <div className="auth-page__container">
        <Breadcrumb items={[
          { label: 'Домашня сторінка', path: '/' },
          { label: 'Моя сторінка', path: '/profile' },
          { label: 'Вхід' },
        ]} />

        <header className="auth-heading">
          <h1>Вхід</h1>
        </header>

        <section className="auth-panel" aria-label="Вхід в обліковий запис">
          <form className="auth-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="auth-primary-btn">Увійти</button>

            <button
              type="button"
              className="auth-link auth-link--left"
              onClick={() => navigate('/forgot-password')}
            >
              Забули пароль?
            </button>
          </form>

          <div className="auth-create">
            <h2>Створити новий обліковий запис</h2>

            <ul>
              <li>Відстежуйте ваші посилки від замовлення до доставки</li>
              <li>Зберігайте історію замовлень</li>
              <li>Додавайте товари до списку бажань</li>
              <li>Зберігайте інформацію для майбутніх покупок</li>
            </ul>

            <button
              type="button"
              className="auth-secondary-btn"
              onClick={() => navigate('/register')}
            >
              Створити новий обліковий запис
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
