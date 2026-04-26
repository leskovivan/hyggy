import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const formatPrice = (value) => `${Math.round(value).toLocaleString('uk-UA')} $`;

const getOldPrice = (item) => {
  if (!item.discountPercent) return null;
  return Math.round(item.price / (1 - item.discountPercent / 100));
};

const CartPage = () => {
  const { cartItems, removeFromCart, totalAmount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const deliveryPrice = 0;
  const finalTotal = totalAmount + deliveryPrice;

  const handleProceedToCheckout = () => {
    if (!user) {
      alert('Будь ласка, увійдіть в акаунт!');
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  return (
    <main className="cart-page-main">
      <section className="cart-panel" aria-label="Кошик">
        {cartItems.length === 0 ? (
          <div className="cart-empty-state">
            <p>Ваш кошик порожній</p>
            <Link to="/category" className="cart-continue-link">Продовжити покупки</Link>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => {
                const oldPrice = getOldPrice(item);
                const itemTotal = item.price * item.quantity;
                const oldTotal = oldPrice ? oldPrice * item.quantity : null;

                return (
                  <article key={item.id} className="cart-item-row">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h2 className="cart-item-name">{item.name}</h2>
                      <p className="cart-item-price">{formatPrice(itemTotal)}</p>
                      {oldTotal && <p className="cart-item-old-price">{formatPrice(oldTotal)}</p>}
                      {item.quantity > 1 && <p className="cart-item-quantity">Кількість: {item.quantity}</p>}
                      <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)} type="button">
                        Видалити
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="cart-summary-line" />

            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Доставка:</span>
                <strong>{formatPrice(deliveryPrice)}</strong>
              </div>
              <div className="cart-summary-row">
                <span>В сумі:</span>
                <strong>{formatPrice(finalTotal)}</strong>
              </div>
            </div>

            <div className="cart-buttons">
              <button className="cart-primary-btn" onClick={handleProceedToCheckout} type="button">
                Продовжити
              </button>
              <Link to="/category" className="cart-continue-link">Продовжити покупки</Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default CartPage;
