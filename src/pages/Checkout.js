import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AddressStep from '../components/AddressStep';
import DeliveryStep from '../components/DeliveryStep';
import PaymentStep from '../components/PaymentStep';
import SuccessStep from '../components/SuccessStep';
import './Checkout.css';

const DEFAULT_DELIVERY_PRICE = 40;

const formatMoney = (value) => `${Number(value || 0).toLocaleString('uk-UA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})} грн`;

const formatDollar = (value) => `${Math.round(value || 0).toLocaleString('uk-UA')} $`;

const getOldPrice = (item) => {
    if (!item.discountPercent) return item.price;
    return Math.round(item.price / (1 - item.discountPercent / 100));
};

const Checkout = () => {
    const [step, setStep] = useState(0);
    const { cartItems, totalAmount, clearCart, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();

    const [orderData, setOrderData] = useState({
        address: { firstName: '', lastName: '', city: '', street: '', building: '', email: '', phone: '' },
        delivery: { type: 'nova-poshta-courier', branch: '', price: DEFAULT_DELIVERY_PRICE },
        payment: { method: '', cardNumber: '', expiry: '', cvv: '' },
        orderId: null,
        completedItems: [],
        completedTotal: 0,
    });

    const deliveryPrice = Number(orderData.delivery?.price ?? DEFAULT_DELIVERY_PRICE);
    const finalTotal = totalAmount + deliveryPrice;

    const totalSavings = useMemo(() => cartItems.reduce((sum, item) => {
        const oldPrice = getOldPrice(item);
        return sum + Math.max(0, oldPrice - item.price) * item.quantity;
    }, 0), [cartItems]);

    const totalVAT = totalAmount * 0.2;

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => Math.max(0, prev - 1));

    const handleFinalSubmit = async () => {
        const orderItems = cartItems.map((item) => ({ ...item }));
        const completedTotal = finalTotal;
        const finalOrder = {
            userId: user?.id,
            date: new Date().toLocaleString('uk-UA'),
            items: orderItems,
            totalAmount: completedTotal,
            details: orderData,
            status: 'Нове',
        };

        try {
            const response = await fetch('http://localhost:3001/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(finalOrder),
            });

            if (!response.ok) {
                throw new Error('Order request failed');
            }

            const savedOrder = await response.json();
            setOrderData((prev) => ({
                ...prev,
                orderId: savedOrder.id,
                completedItems: orderItems,
                completedTotal,
            }));
            clearCart();
            nextStep();
        } catch (error) {
            console.error('Помилка замовлення:', error);
            alert('Не вдалося зберегти замовлення.');
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

                                        <img src={item.image || (item.images && item.images[0]) || ''} alt={item.name} className="checkout-item-image" />

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
                    updateData={(address) => setOrderData((prev) => ({ ...prev, address }))}
                    onNext={nextStep}
                    onCancel={() => setStep(0)}
                    deliveryPrice={deliveryPrice}
                />
            )}

            {step === 2 && (
                <DeliveryStep
                    data={orderData.delivery}
                    updateData={(delivery) => setOrderData((prev) => ({ ...prev, delivery }))}
                    onNext={nextStep}
                    onPrev={prevStep}
                />
            )}

            {step === 3 && (
                <PaymentStep
                    data={orderData.payment}
                    updateData={(payment) => setOrderData((prev) => ({ ...prev, payment }))}
                    onConfirm={handleFinalSubmit}
                    onPrev={prevStep}
                />
            )}

            {step === 4 && (
                <SuccessStep
                    orderId={orderData.orderId}
                    orderData={orderData}
                    items={orderData.completedItems}
                    totalAmount={orderData.completedTotal}
                />
            )}
        </main>
    );
};

export default Checkout;
