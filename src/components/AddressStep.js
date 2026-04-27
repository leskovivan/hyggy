import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatMoney = (value) => `${Number(value).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})} грн`;

const formatDollar = (value) => `${Math.round(value).toLocaleString('uk-UA')} $`;

const AddressStep = ({ data, updateData, onNext, onCancel }) => {
    const { cartItems, totalAmount } = useCart();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const deliveryPrice = 40;
    const finalTotal = totalAmount + deliveryPrice;

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
                <form className="checkout-address-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                    <h2>Адреса</h2>

                    <input className="checkout-address-input" placeholder="Ім'я*" value={data.firstName} onChange={(e) => handleChange('firstName', e.target.value)} />
                    <input className="checkout-address-input" placeholder="Прізвище*" value={data.lastName} onChange={(e) => handleChange('lastName', e.target.value)} />
                    <input className="checkout-address-input" placeholder="Місто*" value={data.city} onChange={(e) => handleChange('city', e.target.value)} />

                    <div className="checkout-address-inline">
                        <input className="checkout-address-input" placeholder="Вулиця*" value={data.street} onChange={(e) => handleChange('street', e.target.value)} />
                        <input className="checkout-address-input" placeholder="Номер будинку*" value={data.building} onChange={(e) => handleChange('building', e.target.value)} />
                    </div>

                    <input className="checkout-address-input" placeholder="E-mail*" value={data.email} onChange={(e) => handleChange('email', e.target.value)} />
                    <input className="checkout-address-input" placeholder="Мобільний телефон*" value={data.phone} onChange={(e) => handleChange('phone', e.target.value)} />

                    <label className="checkout-address-terms">
                        <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
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
                                <img src={item.image} alt={item.name} />
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
