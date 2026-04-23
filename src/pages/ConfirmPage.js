import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';
import Breadcrumb from '../components/Breadcrumb';
import './RegisterPage.css';
const ConfirmPage = () => {
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
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Підтвердження реєстрації' }]} />
      </div>

      <h2 className="login-title">Підтвердження облікового запису</h2>
      <div className="login-content">
        <p>Ми відправили на вказану вами електронну адресу лист з кодом для підтвердження облікового запису.</p>
      </div><div className="login-content">
        
        <div className="login-container register-container-wide">
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group confirmation-code">
              <input style={{"max-width": "500px", margin: "0 auto"}} type="text" placeholder="Введіть код"  onChange={(e) => setEmail(e.target.value)} required />
            </div>

            
            
            <button type="submit" className="login-submit-btn" >Підтвердити реєстрацію</button>
            
            
          </form>
            <button type="button" className="cancel-link" onClick={() => navigate('/login')}>
              Скасувати
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPage;