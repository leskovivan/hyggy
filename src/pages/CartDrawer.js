import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const formatPrice = (value) => `${Math.round(value || 0).toLocaleString('uk-UA')} $`;

const getOldPrice = (item) => {
  if (!item.discountPercent) return null;
  return Math.round(item.price / (1 - item.discountPercent / 100));
};

const CartDrawer = () => {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deliveryPrice = 0;
  const finalTotal = totalAmount + deliveryPrice;

  const handleCheckout = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      alert('Будь ласка, увійдіть в акаунт!');
      toggleCart();
      navigate('/login');
      return;
    }

    toggleCart();
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    toggleCart();
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={toggleCart}></div>

      <aside className={`cart-drawer ${isCartOpen ? 'active' : ''}`} aria-label="Кошик">
        {cartItems.length === 0 ? (
          <div className="drawer-empty-state">
            <p>Ваш кошик порожній</p>
            <button type="button" onClick={toggleCart}>Продовжити покупки</button>
          </div>
        ) : (
          <>
            <div className="drawer-items-list">
              {cartItems.map((item) => {
                const oldPrice = getOldPrice(item);
                const itemTotal = item.price * item.quantity;
                const oldTotal = oldPrice ? oldPrice * item.quantity : null;

                return (
                  <article key={item.id} className="drawer-item">
                    <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} className="drawer-item-img" />
                    <div className="drawer-item-info">
                      <h2>{item.name}</h2>
                      <p className="drawer-item-price">{formatPrice(itemTotal)}</p>
                      {oldTotal && <p className="drawer-item-old-price">{formatPrice(oldTotal)}</p>}
                      {item.quantity > 1 && <p className="drawer-item-quantity">Кількість: {item.quantity}</p>}
                      <button type="button" onClick={() => removeFromCart(item.id)}>
                        Видалити
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="drawer-summary-line" />

            <div className="drawer-summary">
              <div className="drawer-summary-row">
                <span>Доставка:</span>
                <strong>{formatPrice(deliveryPrice)}</strong>
              </div>
              <div className="drawer-summary-row">
                <span>В сумі:</span>
                <strong>{formatPrice(finalTotal)}</strong>
              </div>
            </div>

            <div className="drawer-actions">
              <button type="button" className="drawer-primary-btn" onClick={handleCheckout}>
                Продовжити
              </button>
              <Link to="/category" className="drawer-continue-link" onClick={handleContinueShopping}>
                Продовжити покупки
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
