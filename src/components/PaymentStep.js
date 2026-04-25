import React from 'react';

const PaymentStep = ({ data, updateData, onConfirm, onPrev }) => {
    const handleChange = (field, value) => updateData({ ...data, [field]: value });

    const handleConfirm = () => {
        const { cardNumber, expiry, cvv } = data;

        if (!cardNumber || !expiry || !cvv) {
            alert("Будь ласка, заповніть усі платіжні реквізити!");
            return;
        }

        // Проверка номера карты (убираем пробелы и считаем цифры)
        if (cardNumber.replace(/\s/g, '').length < 16) {
            alert("Номер карти має містити 16 цифр!");
            return;
        }

        // Проверка CVV
        if (cvv.length !== 3) {
            alert("CVV код має містити 3 цифри!");
            return;
        }

        onConfirm();
    };

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
            {/* Вызываем handleConfirm вместо прямого onConfirm */}
            <button className="teal-btn-large" onClick={handleConfirm}>Підтвердження</button>
            <button className="cancel-link" onClick={onPrev}>Скасувати</button>
        </div>
    );
};

export default PaymentStep;