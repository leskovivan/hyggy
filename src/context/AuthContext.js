import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ПЕРЕВІРКА ПРИ ЗАВАНТАЖЕННІ (Запобігаємо розлогіну при F5)
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // ВХІД
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Зберігаємо в браузері
  };

  // ОНОВЛЕННЯ ДАНИХ (для фото, імені тощо)
  const updateUser = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // ЛОГІКА "ОБРАНОГО" (Favorites) з виправленням типів даних
  const toggleFavorite = async (productId) => {
    if (!user) return;

    const currentFavorites = user.favorites || [];
    
    // Використовуємо String() для порівняння, щоб не було проблем "1" !== 1
    const isFav = currentFavorites.some(id => String(id) === String(productId));
    
    // Створюємо оновлений масив
    const updatedFavorites = isFav
      ? currentFavorites.filter(id => String(id) !== String(productId)) // Видаляємо
      : [...currentFavorites, productId]; // Додаємо

    try {
      // Відправляємо PATCH запит на сервер json-server
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorites: updatedFavorites })
      });

      if (response.ok) {
        // Оновлюємо стан через нашу функцію updateUser
        updateUser({ favorites: updatedFavorites });
      }
    } catch (error) {
      console.error("Помилка оновлення обраних на сервері:", error);
    }
  };

  // ВИХІД
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser, toggleFavorite }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);