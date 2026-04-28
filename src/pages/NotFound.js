import Error from '../images/error.png';
import './NotFound.css';

const NotFound = () => {
  return (
    <main className="qa-page">
      <div className="not-found-container">
        <img src={Error} alt="Error 404" className="error-image" />
        <p className="not-found-text">Сторінка не знайдена</p>
      </div>
    </main>
  );
};

export default NotFound;
