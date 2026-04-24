import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminBlogEdit.css';

const AdminProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = !id || id === 'new';

    const [formData, setFormData] = useState({
        article: '',
        name: '',
        category: '',
        shortDescription: '',
        price: '',
        discountPercent: '', // Виправлено: discount -> discountPercent
        alwaysLowPrice: false,
        isNew: false,
        hasDelivery: true,
        inStock: true,       // Додано: стан для наявності
        isGreatOffer: false,
        rating: 5,
        description: '',
        characteristics: [{ label: '', value: '' }],
        images: [] 
    });

    useEffect(() => {
        if (!isNew) {
            fetch(`http://localhost:3001/products/${id}`)
                .then(res => res.json())
                .then(data => {
                    setFormData({
                        ...data,
                        hasDelivery: data.hasDelivery !== undefined ? data.hasDelivery : true,
                        inStock: data.inStock !== undefined ? data.inStock : true, // Обробка наявності
                        rating: data.rating !== undefined ? data.rating : 5
                    });
                })
                .catch(err => console.error("Помилка завантаження:", err));
        }
    }, [id, isNew]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (formData.images.length >= 4) {
                alert("Максимум 4 фотографії!");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, reader.result] 
                }));
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const removeImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleCharacteristicChange = (index, field, value) => {
        const newChars = [...formData.characteristics];
        newChars[index][field] = value;
        setFormData({ ...formData, characteristics: newChars });
    };

    const addCharacteristic = () => {
        setFormData({
            ...formData, 
            characteristics: [...formData.characteristics, { label: '', value: '' }]
        });
    };

    const removeCharacteristic = (index) => {
        const newChars = formData.characteristics.filter((_, i) => i !== index);
        setFormData({ ...formData, characteristics: newChars });
    };

    const handleSave = async () => {
        if (!formData.name || formData.images.length === 0) {
            alert("Додайте назву та хоча б одне фото!");
            return;
        }

        // Перетворюємо ціни та знижки на числа перед відправкою
        const dataToSend = {
            ...formData,
            price: Number(formData.price),
            discountPercent: Number(formData.discountPercent) || 0
        };

        const url = isNew ? 'http://localhost:3001/products' : `http://localhost:3001/products/${id}`;
        const method = isNew ? 'POST' : 'PATCH';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            });

            if (res.ok) {
                alert("Товар успішно збережено!");
                navigate('/admin/products');
            }
        } catch (err) {
            alert("Помилка збереження");
        }
    };

    return (
        <div className="admin-blog-edit">
            <h2 className="section-title">{isNew ? 'Додати товар' : 'Редагувати товар'}</h2>
            
            <div className="form-container">
                <input className="admin-input" placeholder="Введіть артикул..." value={formData.article} onChange={e => setFormData({...formData, article: e.target.value})} />
                <input className="admin-input" placeholder="Введіть назву товару..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                
                <select className="admin-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="">Виберіть категорію</option>
                    <option value="kitchen">Кухня</option>
                    <option value="living-room">Вітальня</option>
                    <option value="bedroom">Спальня</option>
                </select>

                <input className="admin-input" placeholder="Введіть короткий опис..." value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />

                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <input style={{width: '150px'}} className="admin-input" placeholder="Ціна" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    
                    <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px'}}>
                        <input type="checkbox" checked={formData.alwaysLowPrice} onChange={e => setFormData({...formData, alwaysLowPrice: e.target.checked})} /> 
                        Завжди низька ціна
                    </label>
                    {/* Виправлено: discount -> discountPercent */}
                    <input style={{width: '120px'}} className="admin-input" placeholder="% знижки" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: e.target.value})} />
                </div>

                <div style={{ display: 'flex', gap: '20px', padding: '10px 0', flexWrap: 'wrap' }}>
                    <label style={{cursor: 'pointer'}}><input type="checkbox" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} /> Новинка</label>
                    <label style={{cursor: 'pointer'}}><input type="checkbox" checked={formData.hasDelivery} onChange={e => setFormData({...formData, hasDelivery: e.target.checked})} /> Можлива доставка</label>
                    <label style={{cursor: 'pointer'}}><input type="checkbox" checked={formData.inStock} onChange={e => setFormData({...formData, inStock: e.target.checked})} /> В наявності</label>
                    <label style={{cursor: 'pointer'}}><input type="checkbox" checked={formData.isGreatOffer} onChange={e => setFormData({...formData, isGreatOffer: e.target.checked})} /> Чудова пропозиція</label>
                </div>

                <h3>Докладний опис товару</h3>
                <textarea className="admin-textarea" placeholder="Введіть опис товару" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />

                <h3>Характеристики товару</h3>
                {formData.characteristics.map((char, index) => (
                    <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '10px', alignItems: 'center' }}>
                        <input className="admin-input" placeholder="Назва (напр. Матеріал)" value={char.label} onChange={e => handleCharacteristicChange(index, 'label', e.target.value)} />
                        <input className="admin-input" placeholder="Значення (напр. Дуб)" value={char.value} onChange={e => handleCharacteristicChange(index, 'value', e.target.value)} />
                        <button type="button" className="delete-block-btn" style={{position: 'static'}} onClick={() => removeCharacteristic(index)}>✖</button>
                    </div>
                ))}
                
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button type="button" className="teal-btn" onClick={addCharacteristic}>Додати характеристику</button>
                    <button type="button" className="red-btn" onClick={() => setFormData({...formData, characteristics: []})}>Очистити всі</button>
                </div>

                <h3>Галерея (макс. 4)</h3>
                <div className="product-images-grid">
                    {formData.images.map((url, index) => (
                        <div key={index} className="admin-image-preview">
                            <img src={url} alt="" />
                            <button type="button" className="delete-photo-btn" onClick={() => removeImage(index)}>×</button>
                        </div>
                    ))}
                </div>

                <div className="upload-placeholder">
                    <input type="file" id="product-file-input" hidden accept="image/*" onChange={handleFileChange} />
                    <button type="button" className="teal-btn" onClick={() => document.getElementById('product-file-input').click()} disabled={formData.images.length >= 4}>Завантажити файл</button>
                </div>

                <button type="button" className="teal-btn save-btn-main" onClick={handleSave} style={{ marginTop: '30px', width: '100%' }}>Зберегти товар</button>
            </div>
        </div>
    );
};

export default AdminProductEdit;