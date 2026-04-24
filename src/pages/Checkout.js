import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';
import AddressStep from '../components/AddressStep';
import DeliveryStep from '../components/DeliveryStep';
import PaymentStep from '../components/PaymentStep';
import SuccessStep from '../components/SuccessStep';

const Checkout = () => {
    const [step, setStep] = useState(1);
    const { cartItems, totalAmount, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState({
        address: { firstName: '', lastName: '', city: '', street: '', building: '', email: '', phone: '' },
        delivery: { type: 'nova-poshta-courier', branch: '' },
        payment: { method: 'card', cardNumber: '', expiry: '', cvv: '' },
        orderId: null
    });

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleFinalSubmit = async () => {
        const finalOrder = {
            userId: user?.id,
            date: new Date().toLocaleString('uk-UA'),
            items: cartItems,
            totalAmount: totalAmount + 40,
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
                setOrderData(prev => ({ ...prev, orderId: data.id }));
                clearCart(); // Тепер має працювати після правки в CartContext.js
                nextStep();
            }
        } catch (err) {
            console.error("Помилка замовлення:", err);
            alert("Не вдалося зберегти замовлення.");
        }
    };

    return (
        <div className="checkout-container">
            {/* КРОК 1: АДРЕСА */}
            {step === 1 && (
                <AddressStep 
                    data={orderData.address} 
                    updateData={(d) => setOrderData({...orderData, address: d})} 
                    onNext={nextStep} 
                />
            )}

            {/* КРОК 2: ДОСТАВКА */}
            {step === 2 && (
                <DeliveryStep 
                    data={orderData.delivery} 
                    updateData={(d) => setOrderData({...orderData, delivery: d})} 
                    onNext={nextStep} 
                    onPrev={prevStep} 
                />
            )}

            {/* КРОК 3: ОПЛАТА */}
            {step === 3 && (
                <PaymentStep 
                    data={orderData.payment} 
                    updateData={(d) => setOrderData({...orderData, payment: d})} 
                    onConfirm={handleFinalSubmit} 
                    onPrev={prevStep} 
                />
            )}

            {/* КРОК 4: УСПІХ */}
            {step === 4 && <SuccessStep orderId={orderData.orderId} />}
        </div>
    );
};

export default Checkout;