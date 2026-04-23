import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // Стан видимості

  // Завантажуємо кошик з пам'яті при старті
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Зберігаємо в пам'ять при кожній зміні cartItems
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Оновлена функція: тепер приймає кількість (за замовчуванням 1)
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => String(item.id) === String(product.id));
      
      if (existing) {
        // Якщо товар вже є — додаємо нову кількість до існуючої
        return prev.map(item =>
          String(item.id) === String(product.id) 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      // Якщо товару немає — додаємо його з вказаною кількістю
      return [...prev, { ...product, quantity }];
    });
    
    setIsCartOpen(true); // Відкриваємо корзину при додаванні
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item =>
      String(item.id) === String(id) 
        ? { ...item, quantity: Math.max(1, item.quantity + delta) } 
        : item
    ));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      isCartOpen, 
      toggleCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      totalAmount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);