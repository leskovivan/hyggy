import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminToolbar from '../components/AdminToolbar';

import './AdminSuppliesAdd.css';

const AdminSuppliesAdd = () => {
    const navigate = useNavigate();
    const [supplyData, setSupplyData] = useState({
        date: '',
        time: '',
        supplier: '',
        warehouse: '',
        comment: '',
        products: [
            {
                productName: '',
                packaging: '',
                quantity: 0,
                unitPrice: 0,
                amountWithoutTax: 0,
                tax: 0,
                totalAmount: 0,
            },
        ],
    });

    const handleProductChange = (index, event) => {
        const { name, value } = event.target;
        const newProducts = [...supplyData.products];
        newProducts[index][name] = value;
        setSupplyData({ ...supplyData, products: newProducts });
    };

    const addProductRow = () => {
        setSupplyData({
            ...supplyData,
            products: [
                ...supplyData.products,
                {
                    productName: '',
                    packaging: '',
                    quantity: 0,
                    unitPrice: 0,
                    amountWithoutTax: 0,
                    tax: 0,
                    totalAmount: 0,
                },
            ],
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you would typically send data to your backend
        console.log('Supply Data Submitted:', supplyData);
        // Simulate API call and then navigate back to the supplies list
        fetch('http://localhost:3001/supplies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(supplyData),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            navigate('/admin/supplies');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };

    return (
        <div className="admin-layout">
            <main className="admin-main-content">
                <div className="admin-supplies-add-page">
                    <AdminToolbar title="Додавання постачання" onBack={() => navigate('/admin/supplies')} />
                    <form onSubmit={handleSubmit} className="supplies-form">
                        <div className="form-section">
                            <label>Дата та час постачання</label>
                            <div className="date-time-inputs">
                                <input type="date" name="date" value={supplyData.date} onChange={(e) => setSupplyData({ ...supplyData, date: e.target.value })} />
                                <input type="time" name="time" value={supplyData.time} onChange={(e) => setSupplyData({ ...supplyData, time: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-section">
                            <label>Постачальник</label>
                            <input type="text" name="supplier" value={supplyData.supplier} onChange={(e) => setSupplyData({ ...supplyData, supplier: e.target.value })} placeholder="BISTRUP" />
                        </div>

                        <div className="form-section">
                            <label>Склад</label>
                            <input type="text" name="warehouse" value={supplyData.warehouse} onChange={(e) => setSupplyData({ ...supplyData, warehouse: e.target.value })} placeholder="Загальний склад" />
                        </div>

                        <div className="form-section">
                            <label>Коментар</label>
                            <textarea name="comment" value={supplyData.comment} onChange={(e) => setSupplyData({ ...supplyData, comment: e.target.value })} placeholder="Введіть текст..."></textarea>
                        </div>

                        <div className="products-section">
                            <h3>Товари</h3>
                            <table className="products-table">
                                <thead>
                                    <tr>
                                        <th>Найменування</th>
                                        <th>Фасування</th>
                                        <th>Кількість</th>
                                        <th>Ціна за одиницю</th>
                                        <th>Сума без податку</th>
                                        <th>Податок</th>
                                        <th>Загальна сума</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplyData.products.map((product, index) => (
                                        <tr key={index}>
                                            <td><input type="text" name="productName" value={product.productName} onChange={(e) => handleProductChange(index, e)} placeholder="Виберіть..." /></td>
                                            <td><input type="text" name="packaging" value={product.packaging} onChange={(e) => handleProductChange(index, e)} placeholder="Виберіть..." /></td>
                                            <td><input type="number" name="quantity" value={product.quantity} onChange={(e) => handleProductChange(index, e)} /></td>
                                            <td><input type="number" name="unitPrice" value={product.unitPrice} onChange={(e) => handleProductChange(index, e)} /></td>
                                            <td><input type="number" name="amountWithoutTax" value={product.amountWithoutTax} onChange={(e) => handleProductChange(index, e)} /></td>
                                            <td><input type="number" name="tax" value={product.tax} onChange={(e) => handleProductChange(index, e)} /></td>
                                            <td><input type="number" name="totalAmount" value={product.totalAmount} onChange={(e) => handleProductChange(index, e)} /></td>
                                            <td><button type="button" className="remove-product-btn">❌</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button type="button" className="add-more-btn" onClick={addProductRow}>Додати ще</button>
                        </div>

                        <button type="submit" className="save-btn">Зберегти</button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default AdminSuppliesAdd;