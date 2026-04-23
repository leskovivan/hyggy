import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Поки бази немає, ми просто тримаємо об'єкт у стані
  // user: null (не залогінений), { email, role: 'admin' } або { email, role: 'user' }
  const [user, setUser] = useState(null);

  const login = (userData) => setUser(userData); //userData сюди прийде з форми входу
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);