import React from 'react';
import { useCart } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, totalAmount } = useCart();

  return (
    <>
      {/* Затемнение фона */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={toggleCart}></div>

      {/* Сама панель */}
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer__header">
          <h2>Кошик</h2>
          <button className="close-btn" onClick={toggleCart}>×</button>
        </div>

        <div className="cart-drawer__content">
          {cartItems.length === 0 ? (
            <p className="empty-msg">Ваш кошик порожній</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="cart-item-mini">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>{item.price} $</p>
                  <div className="qty-btns">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="total">
              <span>Разом:</span>
              <span>{totalAmount} $</span>
            </div>
            <button className="checkout-btn">Оформити замовлення</button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;