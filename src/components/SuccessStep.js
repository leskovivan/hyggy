import React from 'react';
import { Link } from 'react-router-dom';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})} грн`;

const formatDollar = (value) => `${Math.round(value || 0).toLocaleString('uk-UA')} $`;

const getDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 12);
    return date.toLocaleDateString('uk-UA');
};

const SuccessStep = ({ orderId, orderData, items = [], totalAmount = 0 }) => {
    const address = orderData?.address || {};
    const deliveryAddress = [
        address.street,
        address.building,
        address.city,
        '01015',
    ].filter(Boolean).join(', ');

    return (
        <section className="checkout-success-page" aria-label="Оплата успішна">
            <Link to="/" className="checkout-success-logo" aria-label="HYGGY">
                <img src="/images/logo.svg" alt="HYGGY" />
            </Link>

            <div className="checkout-success-top-line" />

            <div className="checkout-success-content">
                <h1>Оплата успішна</h1>
                <h2>Замовлення №{orderId || '123456'}:</h2>
                <p className="checkout-success-delivery">
                    Доставка за адресою {deliveryAddress || 'вулиця Князів Острозьких, 46/2, Київ, 01015'} до {getDeliveryDate()}
                </p>

                <div className="checkout-success-order">
                    {items.map((item) => (
                        <article className="checkout-success-item" key={item.id}>
                            <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} />
                            <div>
                                <h3>{item.name}</h3>
                                <p>{item.brand}</p>
                            </div>
                            <strong>{formatDollar(item.price * item.quantity)}</strong>
                        </article>
                    ))}

                    <div className="checkout-success-line" />
                    <strong className="checkout-success-total">Усього {formatMoney(totalAmount)}</strong>
                </div>

                <Link to="/" className="checkout-success-home">Повернутись на головну</Link>
            </div>
        </section>
    );
};

export default SuccessStep;
