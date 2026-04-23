import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    // Якщо не залогінений — на сторінку входу
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Якщо треба бути адміном, а ти — ні — на головну
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;