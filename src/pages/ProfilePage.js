import React, { useEffect, useMemo, useState } from 'react';
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

const incompleteStatuses = [
  'не виконано',
  'неоплачено',
  'скасовано',
  'cancelled',
  'canceled',
];

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const normalizeProduct = (product) => {
  if (!product) return product;

  return {
    ...product,
    image: product.image || product.images?.[0] || '/images/product-chair.png',
    brand: product.brand || 'BISTRUP',
    name: product.name || product.productName || 'Обертовий стілець',
    category: product.category || 'chairs',
  };
};

const formatPrice = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${amount.toFixed(amount % 1 ? 2 : 0)} грн` : '—';
};

const formatDate = (value) => {
  if (!value) return 'Дата не вказана';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('uk-UA');
};

const renderStars = (rating) => {
  const roundedRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));

  return Array.from({ length: 5 }, (_, index) => (
    <span className={index < roundedRating ? 'filled' : ''} key={index}>★</span>
  ));
};

const isCompletedOrder = (order) => {
  const status = normalizeText(order.status || order.orderStatus || order.deliveryStatus || order.paymentStatus);

  if (!status || incompleteStatuses.some((item) => status.includes(item))) {
    return false;
  }

  return completedStatuses.some((item) => status.includes(item));
};

const getOrderStatus = (order) => order.status || order.orderStatus || order.deliveryStatus || 'Нове';

const getOrderItems = (order) => order.items || order.products || order.cart || [];

const getOrderTotal = (order) => {
  if (order.totalAmount || order.totalPrice || order.total) {
    return order.totalAmount || order.totalPrice || order.total;
  }

  return getOrderItems(order).reduce((sum, item) => {
    const price = Number(item.price || item.unitPrice || item.totalPrice || 0);
    const quantity = Number(item.quantity || item.count || 1);
    return sum + price * quantity;
  }, 0);
};

const getOrderItemImage = (item) => item.image || item.images?.[0] || item.product?.image || '';

const getOrderItemBrand = (item) => item.brand || item.product?.brand || 'BISTRUP';

const getOrderItemName = (item) => item.name || item.productName || item.product?.name || 'Товар';

const getOrderItemPrice = (item) => {
  const quantity = Number(item.quantity || item.count || 1);
  const unitPrice = Number(item.price || item.unitPrice || item.product?.price || 0);
  const explicitTotal = Number(item.totalPrice || item.total || 0);
  const total = explicitTotal || unitPrice * quantity;

  return {
    unitPrice,
    quantity,
    total: Number.isFinite(total) ? total : 0,
  };
};

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('favorites');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [products, setProducts] = useState(() => fallbackProducts.map(normalizeProduct));
  const [orders, setOrders] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    setName(user?.name || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
  }, [user]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/products').then((res) => res.json()),
      fetch('http://localhost:3001/orders').then((res) => res.json()),
    ])
      .then(([productsData, ordersData]) => {
        if (Array.isArray(productsData) && productsData.length) {
          setProducts(productsData.map(normalizeProduct));
        }

        setOrders(Array.isArray(ordersData) ? ordersData : []);
      })
      .catch((error) => {
        console.error('Помилка завантаження даних профілю:', error);
      });
  }, []);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    const foundRecent = history
      .map((id) => products.find((product) => String(product.id) === String(id)))
      .filter(Boolean)
      .slice(0, 4);

    setRecentProducts(foundRecent);
  }, [products]);

  const favoriteProducts = useMemo(() => {
    if (!user?.favorites?.length) return [];

    return products.filter((product) => user.favorites.some((id) => String(id) === String(product.id)));
  }, [products, user?.favorites]);

  const userOrders = useMemo(() => {
    if (!user) return [];

    return orders.filter((order) => {
      const orderEmail = order.details?.address?.email || order.email || order.customer?.email;
      return String(order.userId) === String(user.id) || normalizeText(orderEmail) === normalizeText(user.email);
    });
  }, [orders, user]);

  const completedOrders = useMemo(() => userOrders.filter(isCompletedOrder), [userOrders]);

  const userReviews = useMemo(() => {
    if (!user) return [];

    const currentUserId = String(user.id || '');
    const currentUserEmail = normalizeText(user.email);
    const currentUserName = normalizeText(`${user.name || ''} ${user.lastName || ''}`.trim());
    const shortName = normalizeText(user.name);

    return products.flatMap((product) => (
      (product.reviews || [])
        .filter((review) => {
          const reviewUserId = String(review.userId || review.authorId || '');
          const reviewEmail = normalizeText(review.email || review.userEmail);
          const author = normalizeText(review.author || review.name || review.userName);

          return (
            (reviewUserId && reviewUserId === currentUserId) ||
            (reviewEmail && reviewEmail === currentUserEmail) ||
            (author && (author === currentUserName || author === shortName))
          );
        })
        .map((review) => ({
          ...review,
          productId: product.id,
          productName: product.name,
          productBrand: product.brand,
          productImage: product.image || product.images?.[0] || '',
        }))
    ));
  }, [products, user]);

  const displayName = [user?.name, user?.lastName].filter(Boolean).join(' ') || 'Василь Василєв';
  const displayEmail = user?.email || 'something@gmail.com';
  const displayPhone = user?.phone || user?.details?.address?.phone || '+380123456789';

  const tabCounts = {
    orders: userOrders.length,
    completed: completedOrders.length,
    reviews: userReviews.length,
    favorites: favoriteProducts.length,
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateUser({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const nextUser = { name, lastName, email, phone };

    try {
      if (user?.id) {
        await fetch(`http://localhost:3001/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextUser),
        });
      }

      updateUser(nextUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Помилка при збереженні профілю:', error);
    }
  };

  const handleCancelEdit = () => {
    setName(user?.name || '');
    setLastName(user?.lastName || '');
    setEmail(user?.email || '');
    setPhone(user?.phone || '');
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Видалити акаунт?')) return;

    try {
      if (user?.id) {
        await fetch(`http://localhost:3001/users/${user.id}`, {
          method: 'DELETE',
        });
      }

      logout();
      navigate('/');
    } catch (error) {
      console.error('Помилка при видаленні акаунта:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderOrderList = (list, emptyText, variant = 'orders') => (
    <div className={`profile-orders-accordion profile-orders-accordion--${variant}`}>
      {list.length > 0 ? (
        list.map((order) => {
          const isExpanded = String(expandedOrderId) === String(order.id);
          const items = getOrderItems(order);
          const date = formatDate(order.date || order.createdAt);
          const status = getOrderStatus(order);

          return (
            <article className={`profile-order-row ${isExpanded ? 'expanded' : ''}`} key={order.id}>
              <button
                type="button"
                className="profile-order-summary"
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                aria-expanded={isExpanded}
              >
                <span className="profile-order-number">Номер замовлення: {order.id}</span>
                <span className="profile-order-date">Дата: {date}</span>
                <span className="profile-order-status">Статус: <u>{status}</u></span>
                <span className="profile-order-price">Ціна: {formatPrice(getOrderTotal(order))}</span>
                <span className="profile-order-chevron" aria-hidden="true"></span>
              </button>

              {isExpanded && (
                <div className="profile-order-details">
                  <div className="profile-order-details-meta">
                    <strong>Номер замовлення: {order.id}</strong>
                    <span>Дата: {date}</span>
                    <span className="profile-order-status">Статус: <u>{status}</u></span>
                  </div>

                  <div className="profile-order-products">
                    {items.length > 0 ? (
                      items.map((item, index) => {
                        const itemPrice = getOrderItemPrice(item);
                        const image = getOrderItemImage(item);
                        const itemName = getOrderItemName(item);

                        return (
                          <div className="profile-order-product" key={`${order.id}-${item.id || index}`}>
                            <div className="profile-order-product-text">
                              <strong>{getOrderItemBrand(item)}</strong>
                              <p>{itemName}</p>
                            </div>

                            {image ? (
                              <img src={image} alt={itemName} />
                            ) : (
                              <div className="profile-order-placeholder" />
                            )}

                            <div className="profile-order-product-price">
                              <strong>Ціна: {formatPrice(itemPrice.total)}</strong>
                              <span>{itemPrice.quantity}x{formatPrice(itemPrice.unitPrice)}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="empty-text">У цьому замовленні немає товарів</p>
                    )}
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

  const renderReviews = () => (
    <div className="profile-reviews-list">
      {userReviews.length > 0 ? (
        userReviews.map((review) => (
          <article className="profile-review-card" key={`${review.productId}-${review.id || review.text || review.comment}`}>
            <div className="profile-review-author">
              <strong>{review.author || review.name || displayName}</strong>
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

  const renderFavorites = () => (
    <div className="profile-grid">
      {favoriteProducts.length > 0 ? (
        favoriteProducts.map((product) => (
          <ItemCard key={product.id} product={product} />
        ))
      ) : (
        <p className="empty-text">У вас поки немає обраних товарів</p>
      )}
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'orders':
        return renderOrderList(userOrders, 'У вас поки немає замовлень', 'orders');
      case 'completed':
        return renderOrderList(completedOrders, 'Виконаних замовлень поки немає', 'completed');
      case 'reviews':
        return renderReviews();
      case 'favorites':
      default:
        return renderFavorites();
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="login-main-container profile-breadcrumb-container">
          <Breadcrumb items={[{ label: 'Домашня сторінка', path: '/' }, { label: 'Моя сторінка' }, { label: 'Профіль' }]} />
        </div>
        <div className="login-main-container">
          <div className="profile-content">
            <h2 className="profile-title">Профіль</h2>
            <p className="empty-text">Увійдіть, щоб переглянути профіль.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="login-main-container profile-breadcrumb-container">
        <Breadcrumb items={[{ label: 'Домашня сторінка', path: '/' }, { label: 'Моя сторінка' }, { label: 'Профіль' }]} />
      </div>

      <div className="login-main-container">
        <div className="profile-content">
          <h2 className="profile-title">Профіль</h2>

          <section className="profile-dashboard">
            <div className="profile-info-card">
              <div className="profile-user-top">
                <div className="profile-avatar-wrapper">
                  <img
                    src={user.avatar || '/images/imgProf.svg'}
                    alt={displayName}
                    className="profile-avatar-img"
                  />
                  <label className="upload-photo-label">
                    <input type="file" onChange={handlePhotoChange} hidden />
                  </label>
                </div>

                <div className="profile-user-details">
                  <h1 className="user-display-name">{displayName}</h1>
                  <label className="profile-upload-link">
                    Завантажити фото
                    <input type="file" onChange={handlePhotoChange} hidden />
                  </label>
                </div>
              </div>

              <div className="profile-contact-list">
                <div>
                  <span>Електронна пошта</span>
                  <strong>{displayEmail}</strong>
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
                <button type="button" onClick={handleLogout} className="profile-logout-btn">
                  Вийти
                </button>
              </div>
            </div>

            <nav className="profile-menu-card" aria-label="Розділи профілю">
              {profileTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsEditing(false);
                    setExpandedOrderId(null);
                  }}
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
                <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Ім'я" />
                <input value={lastName} onChange={(event) => setLastName(event.target.value)} placeholder="Прізвище" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Електронна пошта" type="email" />
                <input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Номер телефону" />

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

          <div className="profile-lists-container">
            {!isEditing && (
              <section className="profile-section">
                <h3 className="profile-section-subtitle">
                  {profileTabs.find((tab) => tab.id === activeTab)?.label}
                </h3>
                {renderActiveTab()}
              </section>
            )}

            <section className="profile-section">
              <h3 className="profile-section-subtitle">Нещодавно переглянуто</h3>
              <div className="profile-grid">
                {recentProducts.length > 0 ? (
                  recentProducts.map((product) => (
                    <ItemCard key={product.id} product={product} />
                  ))
                ) : (
                  <p className="empty-text">Ви ще не переглядали товари</p>
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
