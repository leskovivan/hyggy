import React from 'react';

const PaymentStep = ({ data, updateData, onConfirm, onPrev }) => {
    const handleChange = (field, value) => updateData({ ...data, [field]: value });

    return (
        <div className="checkout-step-container">
            <h1>Оплата</h1>
            <div className="form-group">
                <input className="checkout-input" placeholder="Спосіб оплати*" value={data.method} readOnly />
                <input className="checkout-input" placeholder="Номер карти*" value={data.cardNumber} onChange={e => handleChange('cardNumber', e.target.value)} />
                <div className="inline-fields">
                    <input className="checkout-input" placeholder="MM/YY*" value={data.expiry} onChange={e => handleChange('expiry', e.target.value)} />
                    <input className="checkout-input" placeholder="CVV*" value={data.cvv} onChange={e => handleChange('cvv', e.target.value)} />
                </div>
            </div>
            <button className="teal-btn-large" onClick={onConfirm}>Підтвердження</button>
            <button className="cancel-link" onClick={onPrev}>Скасувати</button>
        </div>
    );
};

export default PaymentStep;