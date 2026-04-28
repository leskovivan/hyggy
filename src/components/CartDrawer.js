import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { useAuth } from '../context/AuthContext'; 
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, totalAmount } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Цей лог допоможе перевірити, чи працює кнопка взагалі
    console.log("Кнопка натиснута! Користувач:", user);

    // 1. ПЕРЕВІРКА АВТОРИЗАЦІЇ
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт, щоб оформити замовлення!");
      toggleCart();
      navigate('/login');
      return;
    }

    // 2. ПЕРЕХІД НА СТОРІНКУ ОГЛЯДУ
    // Ми просто закриваємо кошик і йдемо на /cart.
    // Оформлення (fetch) тепер робимо ТІЛЬКИ на сторінці CartPage.
    toggleCart(); 
    navigate('/cart'); 
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={toggleCart}></div>
      <aside className={`cart-drawer ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Кошик ({cartItems.length})</h2>
          <button className="close-drawer" onClick={toggleCart}>×</button>
        </div>

        <div className="cart-drawer-content">
          {cartItems.length === 0 ? (
            <p className="empty-cart-msg">Ваш кошик порожній</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="drawer-item">
                <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} />
                <div className="drawer-item-info">
                  <h4>{item.name}</h4>
                  <p>{item.price} $</p>
                  <div className="qty-selector">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="delete-item" onClick={() => removeFromCart(item.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="total-box">
              <span>Разом:</span>
              <span>{totalAmount} $</span>
            </div>
            {/* Сама кнопка */}
            <button className="go-to-checkout" onClick={handleCheckout}>
              Оформити замовлення
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;