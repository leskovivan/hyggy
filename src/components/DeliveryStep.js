import React from 'react';

const DeliveryStep = ({ data, updateData, onNext, onPrev }) => {
    return (
        <div className="checkout-step-container">
            <h1>Оплата</h1>
            <h3>Виберіть тип доставки</h3>
            <div className="delivery-options">
                <label className="delivery-option">
                    <input type="radio" name="delivery" checked={data.type === 'np-courier'} onChange={() => updateData({...data, type: 'np-courier'})} />
                    Доставка кур'єром Нової пошти (110,00 грн)
                </label>
                <label className="delivery-option">
                    <input type="radio" name="delivery" checked={data.type === 'np-branch'} onChange={() => updateData({...data, type: 'np-branch'})} />
                    Доставка до відділення Нової пошти (75,00 грн)
                </label>
            </div>

            <div className="map-section">
                <div className="search-bar">
                    <input placeholder="Введіть ваш індекс..." className="checkout-input" />
                    <button className="teal-btn">Пошук</button>
                </div>
                <div className="map-placeholder">
                    {/*  */}
                    <img src="/temp-map.png" alt="Карта відділень" style={{width: '100%'}} />
                </div>
            </div>

            <button className="teal-btn-large" onClick={onNext}>Виберіть тип оплати</button>
            <button className="cancel-link" onClick={onPrev}>Скасувати</button>
        </div>
    );
};

export default DeliveryStep;