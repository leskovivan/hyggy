import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import './LoginPage.css';
import './RegisterPage.css';

const ConfirmPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!code.trim()) {
      alert('Введіть код підтвердження');
      return;
    }

    navigate('/success');
  };

  return (
    <main className="auth-page auth-page--confirm">
      <div className="auth-page__container">
        <Breadcrumb items={[
          { label: 'Домашня сторінка', path: '/' },
          { label: 'Моя сторінка', path: '/profile' },
          { label: 'Створити обліковий запис' },
        ]} />

        <header className="auth-heading">
          <h1>Підтвердження облікового запису</h1>
        </header>

        <section className="auth-confirm-panel" aria-label="Підтвердження облікового запису">
          <p className="auth-confirm-text">
            Ми відправили на вказану вами електронну адресу лист з кодом для підтвердження облікового запису.
          </p>

          <form className="auth-form auth-confirm-form" onSubmit={handleSubmit}>
            <input
              className="auth-code-input"
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

export default ConfirmPage;
