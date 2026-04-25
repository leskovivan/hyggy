import React from 'react';

const AddressStep = ({ data, updateData, onNext }) => {
    const handleChange = (field, value) => updateData({ ...data, [field]: value });

    const handleNext = () => {
        const { firstName, lastName, city, street, phone } = data;
        
        // Базовая проверка на заполнение
        if (!firstName || !lastName || !city || !street || !phone) {
            alert("Будь ласка, заповніть усі обов'язкові поля (помічені зірочкою)!");
            return;
        }

        // Простая проверка длины телефона
        if (phone.replace(/\D/g, '').length < 10) {
            alert("Введіть коректний номер телефону (мінімум 10 цифр)!");
            return;
        }

        onNext();
    };

    return (
        <div className="checkout-step-container">
            <h1>Оплата</h1>
            <h3>Адреса</h3>
            <div className="form-group">
                <input className="checkout-input" placeholder="Ім'я*" value={data.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                <input className="checkout-input" placeholder="Прізвище*" value={data.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                <input className="checkout-input" placeholder="Місто*" value={data.city} onChange={e => handleChange('city', e.target.value)} />
                <div className="inline-fields">
                    <input className="checkout-input" placeholder="Вулиця*" value={data.street} onChange={e => handleChange('street', e.target.value)} />
                    <input className="checkout-input" placeholder="Номер будинку*" value={data.building} onChange={e => handleChange('building', e.target.value)} />
                </div>
                <input className="checkout-input" placeholder="E-mail*" value={data.email} onChange={e => handleChange('email', e.target.value)} />
                <input className="checkout-input" placeholder="Мобільний телефон*" value={data.phone} onChange={e => handleChange('phone', e.target.value)} />
            </div>
            <label className="checkbox-label">
                <input type="checkbox" required /> Прийняти <a href="/terms">Умови та Положення</a>
            </label>
            {/* Вызываем handleNext вместо прямого onNext */}
            <button className="teal-btn-large" onClick={handleNext}>Перейти до доставки</button>
            <button className="cancel-link" onClick={() => window.history.back()}>Скасувати</button>
        </div>
    );
};

export default AddressStep;