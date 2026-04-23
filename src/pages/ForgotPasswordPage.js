import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import Breadcrumb from '../components/Breadcrumb';
import './RegisterPage.css';

const ForgotPasswordPage = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Імітація перевірки коду
    if (code === '1234') { // Наприклад, тестовий код
      alert('Код підтверджено! Тепер ви можете змінити пароль.');
      navigate('/reset-password'); // Або куди тобі треба далі за логікою
    } else {
      alert('Невірний код. Спробуйте ще раз.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-main-container">
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Забули пароль?' }]} />
      </div>

      <h2 className="login-title">Забули пароль?</h2>

      <div className="login-content">
        <div className="login-container">
          {/* Текст-інструкція */}
          <p className="forgot-password-text">
            Напишіть свою електронну адресу для того, щоб скинути пароль. 
            Ми відправимо вам лист з посиланням, де ви зможете ввести новий пароль.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group confirmation-code">
              <input 
                type="text" 
                placeholder="Введіть код" 
                value={code}
                onChange={(e) => setCode(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="login-submit-btn">
                Підтвердити
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

export default ForgotPasswordPage;