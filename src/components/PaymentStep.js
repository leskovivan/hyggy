import React from 'react';
import { Link } from 'react-router-dom';

const PaymentStep = ({ data, updateData, onConfirm, onPrev }) => {
    const handleChange = (field, value) => updateData({ ...data, [field]: value });

    const handleConfirm = () => {
        const { method, cardNumber, expiry, cvv } = data;

        if (!method || !cardNumber || !expiry || !cvv) {
            alert('Будь ласка, заповніть усі платіжні реквізити.');
            return;
        }

        if (cardNumber.replace(/\s/g, '').length < 16) {
            alert('Номер карти має містити 16 цифр.');
            return;
        }

        if (cvv.replace(/\D/g, '').length !== 3) {
            alert('CVV код має містити 3 цифри.');
            return;
        }

        onConfirm();
    };

    return (
        <section className="checkout-payment-page" aria-label="Оплата">
            <Link to="/" className="checkout-payment-logo" aria-label="HYGGY">
                <img src="/images/logo.svg" alt="HYGGY" />
            </Link>

            <div className="checkout-payment-top-line" />

            <form className="checkout-payment-form" onSubmit={(event) => { event.preventDefault(); handleConfirm(); }}>
                <h1>Оплата</h1>

                <input
                    className="checkout-payment-input"
                    placeholder="Спосіб оплати*"
                    value={data.method}
                    onChange={(event) => handleChange('method', event.target.value)}
                />
                <input
                    className="checkout-payment-input"
                    placeholder="Номер карти*"
                    value={data.cardNumber}
                    inputMode="numeric"
                    onChange={(event) => handleChange('cardNumber', event.target.value)}
                />

                <div className="checkout-payment-inline">
                    <input
                        className="checkout-payment-input"
                        placeholder="MM/YY*"
                        value={data.expiry}
                        onChange={(event) => handleChange('expiry', event.target.value)}
                    />
                    <input
                        className="checkout-payment-input"
                        placeholder="CVV*"
                        value={data.cvv}
                        inputMode="numeric"
                        onChange={(event) => handleChange('cvv', event.target.value)}
                    />
                </div>

                <button className="checkout-payment-submit" type="submit">
                    Підтвердження
                </button>
                <button className="checkout-payment-cancel" type="button" onClick={onPrev}>
                    Скасувати
                </button>
            </form>
        </section>
    );
};

export default PaymentStep;
