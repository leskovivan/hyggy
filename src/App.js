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


function AppContent() {
  const location = useLocation();

  // Список статических путей
  const staticPaths = ['/', '/blog', '/shops', '/qa', '/work', '/about', '/about-us', '/category'];
  
  // Проверяем: либо это статический путь, либо динамический путь каталога (/category/что-то)
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
        {/* Динамический роут для категорий из твоего макета */}
        <Route path="/category/:categoryName" element={<CategoryPage />} />


        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Футеры скрываются на 404 */}
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
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;