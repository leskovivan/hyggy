import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DELIVERY_OPTIONS = [
    {
        id: 'nova-poshta-courier',
        title: "Доставка на адресу кур'єром Нової пошти",
        note: '110,00 грн Доставка 10-12 робочих днів',
        price: 110,
    },
    {
        id: 'nova-poshta-branch',
        title: 'Доставка до відділення Нової пошти',
        note: '75,00 грн Доставка 10-12 робочих днів',
        price: 75,
    },
    {
        id: 'ukrposhta-branch',
        title: 'Доставка до відділення Укрпошти',
        note: '50,00 грн Доставка протягом 10-12 робочих днів',
        price: 50,
    },
];

const BRANCHES = [
    {
        id: 'np-31',
        title: 'Нова Пошта. Поштове відділення №31 (до 30 кг) м. Київ,',
        address: 'вулиця Князів Острозьких, 5/2а, Київ, 01010.',
    },
    {
        id: 'np-235',
        title: 'Нова Пошта. Поштове відділення №235 (до 30 кг) м. Київ,',
        address: 'вулиця Князів Острозьких, 46/2, Київ, 01015.',
    },
    {
        id: 'np-7854',
        title: 'Нова Пошта. Поштомат №7854 (до 20 кг) м. Київ,',
        address: "Чорновола В'ячеслава, 30, Київ, 01135.",
    },
];

const DeliveryStep = ({ data, updateData, onNext, onPrev }) => {
    const [postalCode, setPostalCode] = useState('');

    const selectedType = data.type || 'nova-poshta-courier';
    const selectedBranch = data.branch || '';

    const handleTypeChange = (type) => {
        const option = DELIVERY_OPTIONS.find((item) => item.id === type);
        updateData({
            ...data,
            type,
            price: option?.price || 0,
            branch: type === 'nova-poshta-courier' ? '' : selectedBranch,
        });
    };

    const handleBranchChange = (branchId) => {
        const option = DELIVERY_OPTIONS.find((item) => item.id === 'nova-poshta-branch');
        updateData({ ...data, branch: branchId, type: 'nova-poshta-branch', price: option?.price || 75 });
    };

    const handleNext = () => {
        if (selectedType !== 'nova-poshta-courier' && !selectedBranch) {
            alert('Будь ласка, виберіть відділення доставки.');
            return;
        }

        onNext();
    };

    return (
        <section className="checkout-delivery-page" aria-label="Доставка">
            <Link to="/" className="checkout-delivery-logo" aria-label="HYGGY">
                <img src="/images/logo.svg" alt="HYGGY" />
            </Link>

            <div className="checkout-delivery-top-line" />
            <h1 className="checkout-delivery-title">Оплата</h1>

            <div className="checkout-delivery-content">
                <h2>Виберіть тип доставки</h2>

                <div className="checkout-delivery-options">
                    {DELIVERY_OPTIONS.map((option) => (
                        <label className="checkout-delivery-option" key={option.id}>
                            <input
                                type="radio"
                                name="delivery"
                                checked={selectedType === option.id}
                                onChange={() => handleTypeChange(option.id)}
                            />
                            <span className="checkout-delivery-radio" />
                            <strong>{option.title}</strong>
                            <em>({option.note})</em>
                        </label>
                    ))}
                </div>

                <p className="checkout-delivery-hint">
                    Введіть ваш індекс, щоб знайти доставку до відділення Нової пошти
                </p>

                <div className="checkout-delivery-search">
                    <input
                        value={postalCode}
                        onChange={(event) => setPostalCode(event.target.value)}
                        aria-label="Індекс"
                    />
                    <button type="button">Пошук</button>
                </div>

                <div className="checkout-delivery-main">
                    <div className="checkout-delivery-branches">
                        {BRANCHES.map((branch) => (
                            <label className="checkout-delivery-branch" key={branch.id}>
                                <input
                                    type="radio"
                                    name="branch"
                                    checked={selectedBranch === branch.id}
                                    onChange={() => handleBranchChange(branch.id)}
                                />
                                <span className="checkout-delivery-radio" />
                                <span>
                                    <strong>{branch.title}</strong>
                                    <em>{branch.address}</em>
                                </span>
                            </label>
                        ))}
                    </div>

                    <div className="checkout-delivery-map" aria-label="Карта відділень">
                        <div className="checkout-map-tabs">
                            <span>Карта</span>
                            <span>Супутник</span>
                        </div>
                        <span className="checkout-map-pin checkout-map-pin--one">1</span>
                        <span className="checkout-map-pin checkout-map-pin--two">2</span>
                        <span className="checkout-map-pin checkout-map-pin--three">3</span>
                        <span className="checkout-map-pin checkout-map-pin--four">4</span>
                        <span className="checkout-map-pin checkout-map-pin--five">5</span>
                        <span className="checkout-map-city checkout-map-city--kyiv">Київ</span>
                        <span className="checkout-map-city checkout-map-city--zhm">Житомир</span>
                        <span className="checkout-map-city checkout-map-city--vin">Вінниця</span>
                        <div className="checkout-map-controls">
                            <button type="button">+</button>
                            <button type="button">−</button>
                        </div>
                    </div>
                </div>

                <button className="checkout-delivery-submit" type="button" onClick={handleNext}>
                    Виберіть тип оплати
                </button>
                <button className="checkout-delivery-cancel" type="button" onClick={onPrev}>
                    Скасувати
                </button>
            </div>
        </section>
    );
};

export default DeliveryStep;
