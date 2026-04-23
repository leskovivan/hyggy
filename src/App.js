import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Prefooter from './components/prefooter';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import ShopsPage from './pages/ShopsPage';
import QAPage from './pages/QAPage';
import WorkPage from './pages/WorkPage';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';

import CategoryPage from './pages/CategoryPage';
import CatalogPage from './pages/Catalog';
import ProductPage from './pages/ProductPage';

// --- ІМПОРТУЄМО ПРОВАЙДЕР ТА ЗАХИЩЕНИЙ РОУТ ---
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import LoginPage from './pages/LoginPage';
// (Припустимо, що ці сторінки ти скоро створиш)
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const location = useLocation();

  // Додаємо /login, /register та /admin у список відомих шляхів
  const staticPaths = [
    '/', '/blog', '/shops', '/qa', '/work', '/about', '/about-us', '/category', 
    '/login', '/register', '/admin'
  ];
  
  const isKnownPath = 
    staticPaths.includes(location.pathname) || 
    location.pathname.startsWith('/category/');

  return (
    <>
      <Header />
    
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/qa" element={<QAPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/category" element={<CatalogPage />} />
        
        {/* Сторінки авторизації */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}

        {/* ДИНАМІЧНІ РОУТИ */}
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/category/:categoryName/:productId" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* ЗАХИЩЕНИЙ РОУТ ДЛЯ АДМІНКИ */}
         <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminPage />
          </ProtectedRoute>
        } /> 
        

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Футери приховуються на 404 */}
      {isKnownPath && (
        <>
          <Prefooter />
        </>
      )}
      <Footer />
    </>
  );
}

function App() {
  return (
    // --- ОБГОРТАЄМО ВЕСЬ ДОДАТОК В AUTH PROVIDER ---
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;