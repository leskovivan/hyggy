import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { products as fallbackProducts } from './products';
import ItemCard from '../components/ItemCard'; 
import Breadcrumb from '../components/Breadcrumb';
import './ProfilePage.css';

const profileTabs = [
  { id: 'orders', label: 'Мої замовлення' },
  { id: 'completed', label: 'Виконані замовлення' },
  { id: 'reviews', label: 'Мої відгуки' },
  { id: 'favorites', label: 'Обране' },
];

const completedStatuses = [
  'виконано',
  'виконаний',
  'виконана',
  'завершено',
  'завершений',
  'доставлено',
  'доставлений',
  'отримано',
  'отриманий',
  'оплачено',
  'оплачений',
  'completed',
  'complete',
  'done',
  'delivered',
  'finished',
];

const formatPrice = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${amount.toFixed(amount % 1 ? 2 : 0)}₴` : '—';
};

const renderStars = (rating) => {
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return Array.from({ length: 5 }, (_, index) => (
    <span className={index < roundedRating ? 'filled' : ''} key={index}>★</span>
  ));
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const isCompletedOrder = (order) => {
  const status = normalizeText(order.status || order.orderStatus || order.deliveryStatus || order.paymentStatus);

  if (!status || status.includes('не виконано') || status.includes('неоплачено')) {
    return false;
  }

  return completedStatuses.some(completedStatus => status.includes(completedStatus));
};

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('reviews');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [recentProducts, setRecentProducts] = useState([]);
  const [products, setProducts] = useState(fallbackProducts);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // 1. Завантажуємо "Останні переглянуті" (з localStorage)
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('viewedProducts')) || [];
    const foundRecent = history
      .map(id => fallbackProducts.find(p => String(p.id) === String(id)))
      .filter(Boolean);
      
    setRecentProducts(foundRecent);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/products').then(res => res.json()),
      fetch('http://localhost:3001/orders').then(res => res.json()),
    ])
      .then(([productsData, ordersData]) => {
        if (Array.isArray(productsData) && productsData.length) {
          setProducts(productsData);
        }

        setOrders(Array.isArray(ordersData) ? ordersData : []);
      })
      .catch(error => {
        console.error('Помилка завантаження даних профілю:', error);
      });
  }, []);

  // 2. Завантажуємо "Обрані" (з об'єкта юзера)
  useEffect(() => {
    if (user?.favorites) {
      const foundFavs = products.filter(p => user.favorites.some(id => String(id) === String(p.id)));
      setFavoriteProducts(foundFavs);
    } else {
      setFavoriteProducts([]);
    }
  }, [products, user?.favorites]); // Спрацьовує автоматично, коли ти клікаєш на серце в картці

  const userOrders = useMemo(() => {
    if (!user) return [];

    return orders.filter(order => {
      const orderEmail = order.details?.address?.email;

      return String(order.userId) === String(user.id) || (orderEmail && orderEmail === user.email);
    });
  }, [orders, user]);

  const completedOrders = useMemo(() => {
    return userOrders.filter(isCompletedOrder);
  }, [userOrders]);

  const userReviews = useMemo(() => {
    if (!user) return [];

    const currentUserId = String(user.id || '');
    const currentUserEmail = normalizeText(user.email);
    const currentUserName = normalizeText(user.name);

    return products.flatMap(product => (
      (product.reviews || [])
        .filter(review => {
          const author = review.author || review.name;
          const email = review.email;
          const reviewUserId = String(review.userId || '');

          return (
            (reviewUserId && reviewUserId === currentUserId) ||
            (email && normalizeText(email) === currentUserEmail) ||
            (author && normalizeText(author) === currentUserName)
          );
        })
        .map(review => ({
          ...review,
          productId: product.id,
          productName: product.name,
          productBrand: product.brand,
          productImage: product.image || product.images?.[0] || '',
        }))
    ));
  }, [products, user]);

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
        body: JSON.stringify({ name, email, phone })
      });
      if (response.ok) {
        updateUser({ name, email, phone });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Помилка при збереженні:", err);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Видалити акаунт?')) return;

    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        logout();
        navigate('/');
      }
    } catch (err) {
      console.error("Помилка при видаленні акаунту:", err);
    }
  };

  const getOrderTotal = (order) => {
    if (order.totalAmount || order.totalPrice) {
      return order.totalAmount || order.totalPrice;
    }

    return (order.items || []).reduce((sum, item) => {
      const price = Number(item.price || item.unitPrice || 0);
      const quantity = Number(item.quantity || 1);
      return sum + price * quantity;
    }, 0);
  };

  const getOrderItemImage = (item) => item.image || item.images?.[0] || '';

  const getOrderItemBrand = (item) => item.brand || String(item.name || '').split(' ')[0] || 'Товар';

  const getOrderItemPrice = (item) => {
    const quantity = Number(item.quantity || 1);
    const unitPrice = Number(item.price || item.unitPrice || 0);
    const total = unitPrice * quantity;

    return {
      unitPrice,
      quantity,
      total: Number.isFinite(total) ? total : 0,
    };
  };

  if (!user) return <div className="login-main-container"><p>Завантаження...</p></div>;

  const displayPhone = user.phone || user.details?.address?.phone || '+380123456789';
  const tabCounts = {
    orders: userOrders.length,
    completed: completedOrders.length,
    reviews: userReviews.length,
    favorites: favoriteProducts.length,
  };

  const renderOrderList = (list, emptyText, variant = 'orders') => (
    <div className={`profile-orders-accordion profile-orders-accordion--${variant}`}>
      {list.length > 0 ? (
        list.map(order => {
          const isExpanded = String(expandedOrderId) === String(order.id);
          const items = order.items || [];

          return (
            <article className={`profile-order-row ${isExpanded ? 'expanded' : ''}`} key={order.id}>
              <button
                type="button"
                className="profile-order-summary"
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                aria-expanded={isExpanded}
              >
                <span className="profile-order-number">Номер замовлення: {order.id}</span>
                <span className="profile-order-date">Дата: {order.date || 'Дата не вказана'}</span>
                <span className="profile-order-status">Статус: <u>{order.status || 'Нове'}</u></span>
                <span className="profile-order-price">Ціна: {formatPrice(getOrderTotal(order))}</span>
                <span className="profile-order-chevron" aria-hidden="true"></span>
              </button>

              {isExpanded && (
                <div className="profile-order-details">
                  <div className="profile-order-details-meta">
                    <strong>Номер замовлення: {order.id}</strong>
                    <span>Дата: {order.date || 'Дата не вказана'}</span>
                    <span className="profile-order-status">Статус: <u>{order.status || 'Нове'}</u></span>
                  </div>

                  <div className="profile-order-products">
                    {items.map((item, index) => {
                      const itemPrice = getOrderItemPrice(item);
                      const image = getOrderItemImage(item);

                      return (
                        <div className="profile-order-product" key={`${order.id}-${item.id || index}`}>
                          <div className="profile-order-product-text">
                            <strong>{getOrderItemBrand(item)}</strong>
                            <p>{item.name || item.productName || 'Товар'}</p>
                          </div>

                          {image ? (
                            <img src={image} alt={item.name || item.productName || 'Товар'} />
                          ) : (
                            <div className="profile-order-placeholder" />
                          )}

                          <div className="profile-order-product-price">
                            <strong>Ціна: {formatPrice(itemPrice.total)}</strong>
                            <span>{itemPrice.quantity}x{formatPrice(itemPrice.unitPrice)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </article>
          );
        })
      ) : (
        <p className="empty-text">{emptyText}</p>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrderList(userOrders, 'У вас поки немає замовлень', 'orders');
      case 'reviews':
        return (
          <div className="profile-reviews-list">
            {userReviews.length > 0 ? (
              userReviews.map(review => (
                <article className="profile-review-card" key={`${review.productId}-${review.id || review.text || review.comment}`}>
                  <div className="profile-review-author">
                    <strong>{review.author || review.name || user.name || 'Ім’я'}</strong>
                    <div className="profile-review-stars" aria-label={`Рейтинг ${Number(review.rating) || 0} з 5`}>
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <div className="profile-review-image">
                    {review.productImage ? (
                      <img src={review.productImage} alt={review.productName} />
                    ) : (
                      <div className="profile-review-placeholder" />
                    )}
                  </div>

                  <div className="profile-review-product">
                    <strong>{review.productBrand || 'BISTRUP'}</strong>
                    <span>{review.productName}</span>
                  </div>

                  <p>{review.text || review.comment || 'Без тексту'}</p>
                </article>
              ))
            ) : (
              <p className="empty-text">Ви ще не залишали відгуків</p>
            )}
          </div>
        );
      case 'completed':
        return renderOrderList(completedOrders, 'Виконаних замовлень поки немає', 'completed');
      case 'favorites':
      default:
        return (
          <div className="profile-grid">
            {favoriteProducts.length > 0 ? (
              favoriteProducts.map(product => (
                <ItemCard key={product.id} product={product} />
              ))
            ) : (
              <p className="empty-text">У вас поки немає обраних товарів</p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="profile-page">
      <div className="login-main-container">
        <Breadcrumb items={[{ label: 'Головна', path: '/' }, { label: 'Профіль' }]} />
      </div>

      <div className="login-main-container">
        <div className="profile-content">
          <h2 className="profile-title">Профіль</h2>
          
          {/* БЛОК ДАНИХ ЮЗЕРА */}
          <section className="profile-dashboard">
            <div className="profile-info-card">
              <div className="profile-user-top">
                <div className="profile-avatar-wrapper">
                  <img 
                    src={user.avatar || '/images/imgProf.svg'} 
                    alt="Avatar" 
                    className="profile-avatar-img" 
                  />
                  <label className="upload-photo-label">
                    <input type="file" onChange={handlePhotoChange} hidden />
                  </label>
                </div>

                <div className="profile-user-details">
                  <div className="profile-view-group">
                    <h1 className="user-display-name">{user.name}</h1>
                    <label className="profile-upload-link">
                      Завантажити фото
                      <input type="file" onChange={handlePhotoChange} hidden />
                    </label>
                  </div>
                </div>
              </div>

              <div className="profile-contact-list">
                <div>
                  <span>Електронна пошта</span>
                  <strong>{user.email}</strong>
                </div>
                <div>
                  <span>Номер телефону</span>
                  <strong>{displayPhone}</strong>
                </div>
              </div>

              <div className="profile-card-actions">
                <button type="button" onClick={() => setIsEditing(true)} className="edit-data-btn">
                  Редагувати
                </button>
                <button type="button" onClick={() => { logout(); navigate('/'); }} className="profile-logout-btn">
                  Вийти
                </button>
              </div>
            </div>

            <nav className="profile-menu-card" aria-label="Розділи профілю">
              {profileTabs.map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.label}({tabCounts[tab.id] || 0})</span>
                  <span className="profile-tab-arrow" aria-hidden="true"></span>
                </button>
              ))}
            </nav>
          </section>

          {isEditing && (
            <section className="profile-edit-panel">
              <h3>Редагування профілю</h3>

              <div className="profile-edit-form">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ім’я"
                />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Електронна пошта"
                  type="email"
                />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Номер телефону"
                />

                <div className="profile-edit-actions">
                  <button type="button" className="profile-save-edit" onClick={handleSave}>
                    Зберегти
                  </button>
                  <button type="button" className="profile-cancel-edit" onClick={handleCancelEdit}>
                    Скасувати
                  </button>
                </div>

                <button type="button" className="profile-delete-account" onClick={handleDeleteAccount}>
                  Видалити акаунт
                </button>
              </div>
            </section>
          )}

          {/* СПИСКИ ТОВАРІВ */}
          <div className="profile-lists-container">
            
            {!isEditing && (
              <section className="profile-section">
                <h3 className="profile-section-subtitle">
                  {profileTabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                {renderActiveTab()}
              </section>
            )}

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
