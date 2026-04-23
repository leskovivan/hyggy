import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import Breadcrumb from '../components/Breadcrumb';
import './RegisterPage.css';
const SuccsessPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const [agreed, setAgreed] = useState(false);
  const [findOrders, setFindOrders] = useState(false);
  const [subscribe, setSubscribe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Паролі не збігаються!');
      return;
    }
    if (!agreed) {
      alert('Ви повинні прийняти умови');
      return;
    }
    login({ email, name, role: 'user' });
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-main-container">
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Створити обліковий запис' }]} />
      </div>

      <h2 className="login-title">Підтвердження облікового запису</h2>
      <div className="login-content">
        
            <button type="button" className="cancel-link" onClick={() => navigate('/profile')}>
              Перейти в профіль
            </button>
        </div>
      </div>
  );
};

export default SuccsessPage;