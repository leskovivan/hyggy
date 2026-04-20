import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
function AppContent() {
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
      </Routes>
      <Prefooter />
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