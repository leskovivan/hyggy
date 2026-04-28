import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatMoney = (value) => `${Number(value || 0).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})} грн`;

const formatDollar = (value) => `${Math.round(value || 0).toLocaleString('uk-UA')} $`;

const AddressStep = ({ data, updateData, onNext, onCancel, deliveryPrice = 40 }) => {
    const { cartItems, totalAmount } = useCart();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const finalTotal = totalAmount + Number(deliveryPrice || 0);

    const handleChange = (field, value) => updateData({ ...data, [field]: value });

    const handleNext = () => {
        const { firstName, lastName, city, street, building, email, phone } = data;

        if (!firstName || !lastName || !city || !street || !building || !email || !phone) {
            alert("Будь ласка, заповніть усі обов'язкові поля.");
            return;
        }

        if (phone.replace(/\D/g, '').length < 10) {
            alert('Введіть коректний номер телефону.');
            return;
        }

        if (!acceptedTerms) {
            alert('Потрібно прийняти умови та положення.');
            return;
        }

        onNext();
    };

    return (
        <section className="checkout-address-page" aria-label="Адреса доставки">
            <Link to="/" className="checkout-address-logo" aria-label="HYGGY">
                <img src="/images/logo.svg" alt="HYGGY" />
            </Link>

            <div className="checkout-address-top-line" />
            <h1 className="checkout-address-title">Оплата</h1>

            <div className="checkout-address-content">
                <form className="checkout-address-form" onSubmit={(event) => { event.preventDefault(); handleNext(); }}>
                    <h2>Адреса</h2>

                    <input className="checkout-address-input" placeholder="Ім'я*" value={data.firstName} onChange={(event) => handleChange('firstName', event.target.value)} />
                    <input className="checkout-address-input" placeholder="Прізвище*" value={data.lastName} onChange={(event) => handleChange('lastName', event.target.value)} />
                    <input className="checkout-address-input" placeholder="Місто*" value={data.city} onChange={(event) => handleChange('city', event.target.value)} />

                    <div className="checkout-address-inline">
                        <input className="checkout-address-input" placeholder="Вулиця*" value={data.street} onChange={(event) => handleChange('street', event.target.value)} />
                        <input className="checkout-address-input" placeholder="Номер будинку*" value={data.building} onChange={(event) => handleChange('building', event.target.value)} />
                    </div>

                    <input className="checkout-address-input" placeholder="E-mail*" value={data.email} onChange={(event) => handleChange('email', event.target.value)} />
                    <input className="checkout-address-input" placeholder="Мобільний телефон*" value={data.phone} onChange={(event) => handleChange('phone', event.target.value)} />

                    <label className="checkout-address-terms">
                        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
                        <span>Прийняти</span>
                        <Link to="/terms">Умови та Положення</Link>
                    </label>

                    <button className="checkout-address-submit" type="submit">
                        Перейти до доставки
                    </button>
                    <button className="checkout-address-cancel" type="button" onClick={onCancel}>
                        Скасувати
                    </button>
                </form>

                <aside className="checkout-address-summary" aria-label="Підсумок замовлення">
                    <div className="checkout-address-summary-items">
                        {cartItems.map((item) => (
                            <article className="checkout-address-summary-item" key={item.id}>
                                <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} />
                                <div>
                                    <h3>{item.name}</h3>
                                    <p>{item.brand}</p>
                                </div>
                                <strong>{formatDollar(item.price * item.quantity)}</strong>
                            </article>
                        ))}
                    </div>
                    <div className="checkout-address-summary-line" />
                    <strong className="checkout-address-total">Усього {formatMoney(finalTotal)}</strong>
                </aside>
            </div>
        </section>
    );
};

export default AddressStep;
