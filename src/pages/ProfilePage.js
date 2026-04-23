import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products as allProducts } from './products'; // Твій масив товарів
import ItemCard from '../components/ItemCard'; 
import Breadcrumb from '../components/Breadcrumb';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [recentProducts, setRecentProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);

  // 1. Завантажуємо "Останні переглянуті" (з localStorage)
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    const foundRecent = history
      .map(id => allProducts.find(p => p.id === id))
      .filter(Boolean);
      
    setRecentProducts(foundRecent);
  }, []);

  // 2. Завантажуємо "Обрані" (з об'єкта юзера)
  useEffect(() => {
    if (user?.favorites) {
      const foundFavs = allProducts.filter(p => user.favorites.includes(p.id));
      setFavoriteProducts(foundFavs);
    } else {
      setFavoriteProducts([]);
    }
  }, [user?.favorites]); // Спрацьовує автоматично, коли ти клікаєш на серце в картці

  // Завантаження фото
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        updateUser({ name });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Помилка при збереженні:", err);
    }
  };

  if (!user) return <div className="login-main-container"><p>Завантаження...</p></div>;

  return (
    <div className="profile-page">
      <div className="login-main-container">
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Профіль' }]} />
      </div>

      <h2 className="login-title">Мій профіль</h2>

      <div className="login-main-container">
        <div className="profile-content">
          
          {/* БЛОК ДАНИХ ЮЗЕРА */}
          <section className="profile-info-card">
            <div className="profile-avatar-wrapper">
              <img 
                src={user.avatar || '/images/imgProf.svg'} 
                alt="Avatar" 
                className="profile-avatar-img" 
              />
              <label className="upload-photo-label">
                Змінити фото
                <input type="file" onChange={handlePhotoChange} hidden />
              </label>
            </div>

            <div className="profile-user-details">
              {isEditing ? (
                <div className="profile-edit-group">
                  <input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="profile-edit-input" 
                  />
                  <button onClick={handleSave} className="save-btn">Зберегти</button>
                </div>
              ) : (
                <div className="profile-view-group">
                  <h1 className="user-display-name">{user.name}</h1>
                  <p className="user-display-email">{user.email}</p>
                  <button onClick={() => setIsEditing(true)} className="edit-data-btn">Редагувати дані</button>
                </div>
              )}
              <button onClick={() => { logout(); navigate('/'); }} className="profile-logout-btn">
                Вийти з акаунту
              </button>
            </div>
          </section>

          {/* СПИСКИ ТОВАРІВ */}
          <div className="profile-lists-container">
            
            <section className="profile-section">
              <h3 className="profile-section-subtitle">Обрані</h3>
              <div className="profile-grid">
                {favoriteProducts.length > 0 ? (
                  favoriteProducts.map(product => (
                    <ItemCard key={product.id} product={product} />
                  ))
                ) : (
                  <p className="empty-text">У вас поки немає обраних товарів</p>
                )}
              </div>
            </section>

            <section className="profile-section">
              <h3 className="profile-section-subtitle">Останні переглянуті</h3>
              <div className="profile-grid">
                {recentProducts.length > 0 ? (
                  recentProducts.map(product => (
                    <ItemCard key={product.id} product={product} />
                  ))
                ) : (
                  <p className="empty-text">Ви ще не переглядали товарів</p>
                )}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;