import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import './LoginPage.css';
import './RegisterPage.css';

const ForgotPasswordPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (code.trim() === '1234') {
      alert('Код підтверджено! Тепер ви можете змінити пароль.');
      navigate('/login');
      return;
    }

    alert('Невірний код. Спробуйте ще раз.');
  };

  return (
    <main className="auth-page">
      <div className="auth-page__container">
        <Breadcrumb items={[
          { label: 'Домашня сторінка', path: '/' },
          { label: 'Моя сторінка', path: '/profile' },
          { label: 'Забули пароль?' },
        ]} />

        <header className="auth-heading">
          <h1>Забули пароль?</h1>
        </header>

        <section className="auth-panel" aria-label="Відновлення пароля">
          <p className="forgot-password-text">
            Введіть код підтвердження з листа, щоб продовжити відновлення пароля.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Введіть код"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />

            <button type="submit" className="auth-primary-btn">Підтвердити</button>

            <button type="button" className="auth-link" onClick={() => navigate('/login')}>
              Скасувати
            </button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default ForgotPasswordPage;
