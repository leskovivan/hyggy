import React from 'react';
import { useCart } from '../context/AuthContext'; // Або твій CartContext
import './CartDrawer.css';

const CartDrawer = () => {
  const { cartItems, isCartOpen, toggleCart, updateQuantity, removeFromCart, totalAmount } = useCart();

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
                <img src={item.image} alt={item.name} />
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
            <button className="go-to-checkout">Оформити замовлення</button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;