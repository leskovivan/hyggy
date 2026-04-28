import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import './LoginPage.css';
import './RegisterPage.css';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <main className="auth-page auth-page--success">
      <div className="auth-page__container">
        <Breadcrumb items={[
          { label: 'Домашня сторінка', path: '/' },
          { label: 'Моя сторінка', path: '/profile' },
          { label: 'Створити обліковий запис' },
        ]} />

        <header className="auth-heading">
          <h1>Обліковий запис успішно створено</h1>
        </header>

        <section className="auth-success-panel" aria-label="Обліковий запис успішно створено">
          <button type="button" className="auth-link" onClick={() => navigate('/profile')}>
            Перейти в профіль
          </button>
        </section>
      </div>
    </main>
  );
};

export default SuccessPage;
