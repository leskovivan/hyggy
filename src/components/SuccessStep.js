import React from 'react';
import { Link } from 'react-router-dom';

const SuccessStep = ({ orderId }) => {
    return (
        <div className="checkout-step-container success-view">
            <h1>Оплата успішна</h1>
            <div className="order-number-box">
                <h2>Замовлення №{orderId || '123456'}:</h2>
                <p>Доставка буде здійснена за вказаною вами адресою.</p>
            </div>
            <div className="mini-order-summary">
                 {/* Тут можна знову вивести ItemCard або просто список товарів */}
            </div>
            <Link to="/" className="home-link">Повернутись на головну</Link>
        </div>
    );
};

export default SuccessStep;