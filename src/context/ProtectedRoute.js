import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    // Якщо треба в адмінку — на адмін-логін, інакше на звичайний
    return <Navigate to={adminOnly ? "/admin/login" : "/login"} />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Якщо ти не адмін — на головну
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;