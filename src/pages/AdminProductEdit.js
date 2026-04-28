import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminProductEdit.css';

const emptyCharacteristic = () => ({ label: '', value: '' });

const categoryOptions = [
    { value: 'bedroom', label: 'Спальня' },
    { value: 'bathroom', label: 'Ванна' },
    { value: 'office', label: 'Офіс' },
    { value: 'living-room', label: 'Вітальня' },
    { value: 'kitchen', label: 'Кухня' },
    { value: 'garden', label: 'Для саду' },
    { value: 'kids', label: 'Дитяча кімната' },
    { value: 'dining', label: 'Їдальня' },
    { value: 'hallway', label: 'Коридор' },
    { value: 'storage', label: 'Зберігання' },
];

const initialFormData = {
    article: '',
    name: '',
    brand: 'BISTRUP',
    category: '',
    shortDescription: '',
    price: '',
    discountPercent: '',
    alwaysLowPrice: false,
    isNew: false,
    hasDelivery: true,
    inStock: true,
    isGreatOffer: false,
    rating: 5,
    description: '',
    characteristics: [emptyCharacteristic(), emptyCharacteristic(), emptyCharacteristic()],
    images: [],
};

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNewProduct = !id || id === 'new';
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (isNewProduct) return;

        fetch(`http://localhost:3001/products/${id}`)
            .then((response) => response.json())
            .then((data) => {
                const images = data.images?.length ? data.images : [data.image].filter(Boolean);

                setFormData({
                    ...initialFormData,
                    ...data,
                    brand: data.brand || 'BISTRUP',
                    price: data.price ?? '',
                    discountPercent: data.discountPercent ?? '',
                    hasDelivery: data.hasDelivery !== undefined ? data.hasDelivery : true,
                    inStock: data.inStock !== undefined ? data.inStock : true,
                    rating: data.rating !== undefined ? data.rating : 5,
                    characteristics: data.characteristics?.length ? data.characteristics : initialFormData.characteristics,
                    images,
                });
            })
            .catch((error) => console.error('Помилка завантаження товару:', error));
    }, [id, isNewProduct]);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const availableSlots = 4 - formData.images.length;
        const selectedFiles = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            alert('Можна завантажити максимум 4 фото.');
        }

        selectedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, reader.result],
                }));
            };
            reader.readAsDataURL(file);
        });

        event.target.value = '';
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, imageIndex) => imageIndex !== index),
        }));
    };

    const handleCharacteristicChange = (index, field, value) => {
        setFormData((prev) => ({
            ...prev,
            characteristics: prev.characteristics.map((item, itemIndex) => (
                itemIndex === index ? { ...item, [field]: value } : item
            )),
        }));
    };

    const addCharacteristic = () => {
        setFormData((prev) => ({
            ...prev,
            characteristics: [...prev.characteristics, emptyCharacteristic()],
        }));
    };

    const clearCharacteristics = () => {
        setFormData((prev) => ({
            ...prev,
            characteristics: [emptyCharacteristic(), emptyCharacteristic(), emptyCharacteristic()],
        }));
    };

    const removeCharacteristic = (index) => {
        setFormData((prev) => ({
            ...prev,
            characteristics: prev.characteristics.filter((_, itemIndex) => itemIndex !== index),
        }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Введіть назву товару.');
            return;
        }

        if (!formData.category) {
            alert('Виберіть категорію товару.');
            return;
        }

        if (!formData.images.length) {
            alert('Додайте хоча б одне фото товару.');
            return;
        }

        const dataToSend = {
            ...formData,
            price: Number(formData.price) || 0,
            discountPercent: Number(formData.discountPercent) || 0,
            image: formData.images[0],
            characteristics: formData.characteristics.filter((item) => item.label || item.value),
        };

        const url = isNewProduct ? 'http://localhost:3001/products' : `http://localhost:3001/products/${id}`;
        const method = isNewProduct ? 'POST' : 'PATCH';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                throw new Error('Save failed');
            }

            alert('Товар успішно збережено!');
            navigate('/admin/products');
        } catch (error) {
            console.error('Помилка збереження товару:', error);
            alert('Помилка збереження товару.');
        }
    };

    return (
        <div className="admin-product-edit">
            <h2 className="admin-product-title">
                {isNewProduct ? 'Створення товару' : 'Редагування товару'}
            </h2>

            <div className="admin-product-form">
                <input
                    className="admin-product-input"
                    placeholder="Введіть артикул..."
                    value={formData.article}
                    onChange={(event) => updateField('article', event.target.value)}
                />
                <input
                    className="admin-product-input"
                    placeholder="Введіть назву товару..."
                    value={formData.name}
                    onChange={(event) => updateField('name', event.target.value)}
                />
                <select
                    className="admin-product-input admin-product-select"
                    value={formData.category}
                    onChange={(event) => updateField('category', event.target.value)}
                >
                    <option value="">Виберіть категорію</option>
                    {categoryOptions.map((category) => (
                        <option key={category.value} value={category.value}>{category.label}</option>
                    ))}
                </select>
                <input
                    className="admin-product-input"
                    placeholder="Введіть короткий опис товару..."
                    value={formData.shortDescription}
                    onChange={(event) => updateField('shortDescription', event.target.value)}
                />

                <div className="admin-product-price-row">
                    <input
                        className="admin-product-input admin-product-price"
                        placeholder="Введіть ціну..."
                        value={formData.price}
                        onChange={(event) => updateField('price', event.target.value)}
                    />

                    <label className="admin-product-check admin-product-check--wide">
                        <input
                            type="checkbox"
                            checked={formData.alwaysLowPrice}
                            onChange={(event) => updateField('alwaysLowPrice', event.target.checked)}
                        />
                        <span>Завжди низька ціна</span>
                    </label>

                    <input
                        className="admin-product-input admin-product-discount"
                        placeholder="Введіть % знижки..."
                        value={formData.discountPercent}
                        onChange={(event) => updateField('discountPercent', event.target.value)}
                    />
                </div>

                <div className="admin-product-options">
                    <label className="admin-product-check">
                        <input type="checkbox" checked={formData.isNew} onChange={(event) => updateField('isNew', event.target.checked)} />
                        <span>Новинка</span>
                    </label>
                    <label className="admin-product-check">
                        <input type="checkbox" checked={formData.hasDelivery} onChange={(event) => updateField('hasDelivery', event.target.checked)} />
                        <span>Можлива доставка</span>
                    </label>
                    <label className="admin-product-check">
                        <input type="checkbox" checked={formData.isGreatOffer} onChange={(event) => updateField('isGreatOffer', event.target.checked)} />
                        <span>Чудова пропозиція</span>
                    </label>
                </div>

                <section className="admin-product-section">
                    <h3>Докладний опис товару</h3>
                    <textarea
                        className="admin-product-textarea"
                        placeholder="Введіть опис товару"
                        value={formData.description}
                        onChange={(event) => updateField('description', event.target.value)}
                    />
                </section>

                <section className="admin-product-section">
                    <h3>Характеристики товару</h3>

                    <div className="admin-characteristics">
                        {formData.characteristics.map((characteristic, index) => (
                            <div className="admin-characteristic-row" key={index}>
                                <input
                                    className="admin-product-input"
                                    placeholder="Назва характеристики"
                                    value={characteristic.label}
                                    onChange={(event) => handleCharacteristicChange(index, 'label', event.target.value)}
                                />
                                <input
                                    className="admin-product-input"
                                    placeholder="Значення характеристики"
                                    value={characteristic.value}
                                    onChange={(event) => handleCharacteristicChange(index, 'value', event.target.value)}
                                />
                                {formData.characteristics.length > 1 && (
                                    <button
                                        type="button"
                                        className="admin-characteristic-remove"
                                        onClick={() => removeCharacteristic(index)}
                                        aria-label="Видалити характеристику"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="admin-product-actions-row">
                        <button type="button" className="admin-product-action" onClick={addCharacteristic}>
                            Додати характеристику
                        </button>
                        <button type="button" className="admin-product-action" onClick={clearCharacteristics}>
                            Очистити всі характеристики
                        </button>
                    </div>
                </section>

                <div className="admin-product-gallery">
                    {formData.images.map((url, index) => (
                        <div className="admin-product-image" key={`${url}-${index}`}>
                            <img src={url} alt={`Фото товару ${index + 1}`} />
                            <button type="button" onClick={() => removeImage(index)} aria-label="Видалити фото">×</button>
                        </div>
                    ))}
                </div>

                <div className="admin-product-upload">
                    <span>Виберіть фото... (до 4 шт.)</span>
                    <label>
                        Завантажити
                        <input type="file" hidden accept="image/*" multiple onChange={handleFileChange} disabled={formData.images.length >= 4} />
                    </label>
                </div>

                <button type="button" className="admin-product-save" onClick={handleSave}>
                    Зберегти
                </button>
            </div>
        </div>
    );
};

export default AdminProductEdit;
