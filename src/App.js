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
import RegisterPage from './pages/RegisterPage';
import ConfirmPage from './pages/ConfirmPage';
import SuccsessPage from './pages/SuccessPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { CartProvider } from './context/CartContext';
import CartDrawer from './pages/CartDrawer';
import SearchPage from './pages/SearchPage';
import BlogPost from './pages/BlogPost';

// --- АДМІНКА ---
import AdminLayout from './pages/AdminLayout'; 
import AdminLogin from './pages/AdminLogin';
import AdminBlogList from './pages/AdminBlogList'; // <-- ДОБАВЛЕН ИМПОРТ СПИСКА БЛОГОВ
import AdminBlogEdit from './pages/AdminBlogEdit'; 
import AdminProductList from './pages/AdminProductList';
import AdminProductEdit from './pages/AdminProductEdit';
import AdminReviews from './pages/AdminReviews';
import AdminOrders from './pages/AdminOrders';
import CartPage from './components/CartPage';
import Checkout from './pages/Checkout';

function AppContent() {
  const location = useLocation();

  const staticPaths = [
    '/', '/blog', '/shops', '/qa', '/work', '/about', '/about-us', '/category'
  ];
  
  const isKnownPath = 
    staticPaths.includes(location.pathname) || 
    location.pathname.startsWith('/category/');

  // ПРОВЕРКА: Находимся ли мы сейчас в админ-панели?
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      {/* Прячем обычный Header магазина, если мы в админке */}
      {!isAdminRoute && <Header />}
    
      <Routes>
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
            {/* Вложенные роуты (будут рендериться вместо <Outlet /> внутри AdminLayout) */}
            
            {/* <-- ЗАМЕНЕНО: Теперь здесь реальный список блогов вместо заголовка --> */}
            <Route path="blogs" element={<AdminBlogList />} />
            
            {/* Роути для створення та редагування статті */}
            <Route path="blogs/new" element={<AdminBlogEdit />} />
            <Route path="blogs/edit/:id" element={<AdminBlogEdit />} />
            
            <Route path="products" element={<AdminProductList />} />
              <Route path="products/new" element={<AdminProductEdit />} />
              <Route path="products/edit/:id" element={<AdminProductEdit />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/orders" element={<AdminOrders />} />

        </Route>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/shops" element={<ShopsPage />} />
        <Route path="/qa" element={<QAPage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/category" element={<CatalogPage />} />
         <Route path="/cart" element={<CartPage />} />
        
        {/* 2. Головний хаб оформлення замовлення */}
        <Route path="/checkout" element={<Checkout />} /> 
        {/* ДИНАМІЧНІ РОУТИ */}
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/category/:categoryName/:productId" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />
        <Route path="/success" element={<SuccsessPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        
        {/* === АДМІН-ПАНЕЛЬ === */}
        {/* Публичный роут для входа админа */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Защищенная оболочка Админки */}
        

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Прячем футеры, если это 404 ИЛИ если мы в админке */}
      {!isAdminRoute && isKnownPath && (
        <>
          <Prefooter />
        </>
      )}
      {!isAdminRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    // --- ОБГОРТАЄМО ВЕСЬ ДОДАТОК В AUTH PROVIDER ---
    <AuthProvider>
      <CartProvider>
      <Router>
        <CartDrawer />
        <div className="App">
          <AppContent />
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;