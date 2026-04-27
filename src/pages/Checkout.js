import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Checkout.css';
import AddressStep from '../components/AddressStep';
import DeliveryStep from '../components/DeliveryStep';
import PaymentStep from '../components/PaymentStep';
import SuccessStep from '../components/SuccessStep';

const formatMoney = (value) => `${Number(value).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})} грн`;

const formatDollar = (value) => `${Math.round(value).toLocaleString('uk-UA')} $`;

const getOldPrice = (item) => {
    if (!item.discountPercent) return item.price;
    return Math.round(item.price / (1 - item.discountPercent / 100));
};

const Checkout = () => {
    const [step, setStep] = useState(0);
    const { cartItems, totalAmount, clearCart, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();
    const deliveryPrice = 40;
    const totalSavings = cartItems.reduce((sum, item) => {
        const oldPrice = getOldPrice(item);
        return sum + Math.max(0, oldPrice - item.price) * item.quantity;
    }, 0);
    const totalVAT = totalAmount * 0.2;
    const finalTotal = totalAmount + deliveryPrice;

    const [orderData, setOrderData] = useState({
        address: { firstName: '', lastName: '', city: '', street: '', building: '', email: '', phone: '' },
        delivery: { type: 'nova-poshta-courier', branch: '' },
        payment: { method: 'card', cardNumber: '', expiry: '', cvv: '' },
        orderId: null
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleFinalSubmit = async () => {
        const orderItems = cartItems;
        const completedTotal = finalTotal;
        const finalOrder = {
            userId: user?.id,
            date: new Date().toLocaleString('uk-UA'),
            items: orderItems,
            totalAmount: completedTotal,
            details: orderData,
            status: "Нове"
        };

        try {
            const res = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrder)
            });

            if (res.ok) {
                const data = await res.json();
                setOrderData(prev => ({
                    ...prev,
                    orderId: data.id,
                    completedItems: orderItems,
                    completedTotal,
                }));
                clearCart(); // Тепер має працювати після правки в CartContext.js
                nextStep();
            }
        } catch (err) {
            console.error("Помилка замовлення:", err);
            alert("Не вдалося зберегти замовлення.");
        }
    };

    return (
        <main className="checkout-container">
            {step === 0 && (
                <section className="checkout-overview" aria-label="Огляд кошика">
                    <Link to="/" className="checkout-logo-link" aria-label="HYGGY">
                        <img src="/images/logo.svg" alt="HYGGY" className="checkout-logo" />
                    </Link>

                    <h1 className="checkout-title">Огляд кошика</h1>

                    {cartItems.length === 0 ? (
                        <div className="checkout-empty">
                            <p>Ваш кошик порожній</p>
                            <Link to="/category" className="checkout-secondary-btn">Продовжити покупки</Link>
                        </div>
                    ) : (
                        <>
                            <div className="checkout-items">
                                {cartItems.map((item) => (
                                    <article className="checkout-item" key={item.id}>
                                        <button
                                            type="button"
                                            className="checkout-remove-icon"
                                            onClick={() => removeFromCart(item.id)}
                                            aria-label="Видалити товар"
                                        >
                                            <span />
                                        </button>

                                        <img src={item.image} alt={item.name} className="checkout-item-image" />

                                        <div className="checkout-item-copy">
                                            <h2>{item.name}</h2>
                                            <p>{item.brand}</p>
                                        </div>

                                        <div className="checkout-quantity">
                                            <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Зменшити кількість">
                                                -
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Збільшити кількість">
                                                +
                                            </button>
                                        </div>

                                        <strong className="checkout-item-price">{formatDollar(item.price * item.quantity)}</strong>
                                    </article>
                                ))}
                            </div>

                            <div className="checkout-divider" />

                            <div className="checkout-summary">
                                <p>Загальна економія {formatMoney(totalSavings)}</p>
                                <p>Доставка {formatMoney(deliveryPrice)}</p>
                                <p>Сума ПДВ {formatMoney(totalVAT)}</p>
                                <p>Доставка протягом 10-12 робочих днів</p>
                                <strong>Усього {formatMoney(finalTotal)}</strong>
                            </div>

                            <div className="checkout-actions">
                                <button type="button" className="checkout-primary-btn" onClick={nextStep}>
                                    Продовжити
                                </button>
                                <Link to="/category" className="checkout-secondary-btn">
                                    Продовжити покупки
                                </Link>
                            </div>
                        </>
                    )}
                </section>
            )}

            {step === 1 && (
                <AddressStep 
                    data={orderData.address} 
                    updateData={(d) => setOrderData({...orderData, address: d})} 
                    onNext={nextStep}
                    onCancel={() => setStep(0)}
                />
            )}

            {step === 2 && (
                <DeliveryStep 
                    data={orderData.delivery} 
                    updateData={(d) => setOrderData({...orderData, delivery: d})} 
                    onNext={nextStep} 
                    onPrev={prevStep} 
                />
            )}

            {step === 3 && (
                <PaymentStep 
                    data={orderData.payment} 
                    updateData={(d) => setOrderData({...orderData, payment: d})} 
                    onConfirm={handleFinalSubmit} 
                    onPrev={prevStep} 
                />
            )}

            {step === 4 && (
                <SuccessStep
                    orderId={orderData.orderId}
                    orderData={orderData}
                    items={orderData.completedItems || cartItems}
                    totalAmount={orderData.completedTotal ?? finalTotal}
                />
            )}
        </main>
    );
};

export default Checkout;
