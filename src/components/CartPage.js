import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalAmount } = useCart(); // Видалили clearCart
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- РОЗРАХУНКИ ЯК НА МАКЕТІ ---
  const deliveryPrice = 40.00;
  const vatRate = 0.20; 
  const totalVAT = (totalAmount * vatRate).toFixed(2);
  
  const totalSavings = cartItems.reduce((acc, item) => {
    const oldPrice = item.discountPercent ? Math.round(item.price / (1 - item.discountPercent / 100)) : item.price;
    return acc + (oldPrice - item.price) * item.quantity;
  }, 0);

  const finalTotal = (totalAmount + deliveryPrice).toFixed(2);

  // ОНОВЛЕНА ФУНКЦІЯ: Тільки перехід
  const handleProceedToCheckout = () => {
    if (!user) {
      alert("Будь ласка, увійдіть в акаунт!");
      navigate('/login');
      return;
    }

    // Переходимо до кроку 1 (Адреса) у Checkout.js
    navigate('/checkout'); 
  };

  return (
    <div className="cart-page-main">
      <header className="cart-header">
         <img src="/logo.png" alt="Hyqqy" className="logo" />
      </header>

      <h1 className="overview-title">Огляд кошика</h1>

      <div className="cart-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item-row">
            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>×</button>
            <img src={item.image} alt={item.name} className="item-img" />
            
            <div className="item-details">
              <p className="item-name">{item.name}</p>
              <p className="item-brand">{item.brand}</p>
            </div>

            <div className="qty-control">
              <button onClick={() => updateQuantity(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)}>+</button>
            </div>

            <div className="item-price">{item.price * item.quantity} $</div>
          </div>
        ))}
      </div>

      <div className="cart-summary-details">
        <p>Загальна економія: {totalSavings.toFixed(2)} грн</p>
        <p>Доставка: {deliveryPrice.toFixed(2)} грн</p>
        <p>Сума ПДВ: {totalVAT} грн</p>
        <p className="delivery-time">Доставка протягом 10-12 робочих днів</p>
        
        <h2 className="grand-total">Усього {finalTotal} грн</h2>
      </div>

      <div className="cart-buttons">
        {/* Кнопка тепер просто веде далі за маршрутом */}
        <button className="teal-btn-large" onClick={handleProceedToCheckout}>Продовжити</button>
        <Link to="/" className="continue-shopping-btn">Продовжити покупки</Link>
      </div>
    </div>
  );
};

export default CartPage;