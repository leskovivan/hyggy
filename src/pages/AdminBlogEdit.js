import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './AdminBlogEdit.css';

const AdminBlogEdit = () => {
    const { id } = useParams(); // Для маршрута /blogs/new это будет undefined
    const navigate = useNavigate();

    // Определяем, создаем ли мы новый пост или редактируем старый
    const isNew = !id || id === 'new';

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Для дому');
    const [coverImage, setCoverImage] = useState('');
    const [content, setContent] = useState([]); 
    const [keywords, setKeywords] = useState([]);
    const [newKeyword, setNewKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    // ЗАГРУЗКА ДАННЫХ ДЛЯ РЕДАКТИРОВАНИЯ
    useEffect(() => {
        if (!isNew) {
            fetch(`http://localhost:3001/blogs/${id}`)
                .then(res => {
                    if (!res.ok) throw new Error('Статтю не знайдено');
                    return res.json();
                })
                .then(data => {
                    setTitle(data.title || '');
                    setCategory(data.mainCategory || 'Для дому');
                    setCoverImage(data.coverImage || '');
                    setContent(data.content || []);
                    setKeywords(data.keywords || []);
                })
                .catch(err => console.error("Помилка завантаження:", err));
        }
    }, [id, isNew]);

    // --- ЛОГІКА ЗАВАНТАЖЕННЯ ФАЙЛІВ (BASE64) ---
    
    // Обробник для головної обкладинки
    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverImage(reader.result); // Зберігаємо Base64
            };
            reader.readAsDataURL(file);
        }
    };

    // Обробник для фото в галереях
    const handleFileSelect = (e, blockId) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setContent(content.map(b => 
                    b.id === blockId ? { ...b, images: [...(b.images || []), reader.result] } : b
                ));
            };
            reader.readAsDataURL(file);
        }
    };

    // ЛОГИКА СОХРАНЕНИЯ
    const handleSave = async () => {
        if (!title || !coverImage) {
            alert("Заповніть назву та додайте обкладинку!");
            return;
        }

        setLoading(true);

        const blogData = {
            title,
            mainCategory: category,
            coverImage,
            content,
            keywords,
            ...(isNew && { popularity: 0 })
        };

        const url = isNew 
            ? 'http://localhost:3001/blogs' 
            : `http://localhost:3001/blogs/${id}`;
        
        const method = isNew ? 'POST' : 'PATCH';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });

            if (response.ok) {
                alert(isNew ? "Блог створено!" : "Зміни збережено!");
                navigate('/admin/blogs');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Помилка запиту');
            }
        } catch (err) {
            alert("Не вдалося зберегти дані: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // Вспомогательные функции
    const addTextBlock = () => setContent([...content, { id: Date.now(), type: 'text', value: '' }]);
    const addGalleryBlock = () => setContent([...content, { id: Date.now(), type: 'gallery', images: [] }]);
    const removeBlock = (blockId) => setContent(content.filter(b => b.id !== blockId));
    const updateTextBlock = (blockId, newValue) => setContent(content.map(b => b.id === blockId ? { ...b, value: newValue } : b));
    
    const handleAddKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword('');
        }
    };

    const removeKeyword = (kw) => setKeywords(keywords.filter(k => k !== kw));

    return (
        <div className="admin-blog-edit">
            <div className="admin-header">
                <Link to="/admin/blogs" className="back-btn">{'<'} {isNew ? 'Створення блогу' : 'Редагування блогу'}</Link>
            </div>

            <div className="form-container">
                <input 
                    type="text" 
                    className="admin-input" 
                    placeholder="Заголовок блогу" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <select 
                    className="admin-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="Для дому">Для дому</option>
                    <option value="Для саду">Для саду</option>
                    <option value="Для сну">Для сну</option>
                </select>

                <div className="admin-section">
                    <h3>Обкладинка блогу</h3>
                    <div className="cover-upload-area">
                        {coverImage ? (
                            <div className="image-preview-wrapper">
                                <img src={coverImage} alt="Cover" />
                                <button className="delete-icon-btn" onClick={() => setCoverImage('')}>🗑️</button>
                            </div>
                        ) : (
                            <div className="upload-placeholder">
                                <span>Виберіть фото...</span>
                                {/* Прихований інпут для обкладинки */}
                                <input 
                                    type="file" 
                                    id="cover-input" 
                                    hidden 
                                    accept="image/*" 
                                    onChange={handleCoverChange} 
                                />
                                <button 
                                    className="teal-btn" 
                                    onClick={() => document.getElementById('cover-input').click()}
                                >
                                    Завантажити
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="admin-section">
                    <h3>Вміст блогу</h3>
                    <div className="dynamic-content-area">
                        {content.map((block) => (
                            <div key={block.id} className="content-block-editor">
                                <button className="delete-block-btn" onClick={() => removeBlock(block.id)}>✖</button>
                                
                                {block.type === 'text' && (
                                    <textarea 
                                        className="admin-textarea"
                                        placeholder="Введіть текст..."
                                        value={block.value}
                                        onChange={(e) => updateTextBlock(block.id, e.target.value)}
                                    />
                                )}

                                {block.type === 'gallery' && (
                                    <div className="gallery-editor">
                                        <div className="gallery-images">
                                            {block.images && block.images.map((img, i) => (
                                                <img key={i} src={img} alt={`img-${i}`} />
                                            ))}
                                        </div>
                                        
                                        <input 
                                            type="file" 
                                            accept="image/*" 
                                            style={{ display: 'none' }} 
                                            id={`file-input-${block.id}`}
                                            onChange={(e) => handleFileSelect(e, block.id)} 
                                        />
                                        
                                        <button 
                                            className="teal-btn" 
                                            onClick={() => document.getElementById(`file-input-${block.id}`).click()}
                                        >
                                            Завантажити файл
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="content-controls">
                        <button className="teal-btn" onClick={addGalleryBlock}>Додати галерею</button>
                        <button className="teal-btn" onClick={addTextBlock}>Додати текстове поле</button>
                        <button className="red-btn" onClick={() => setContent([])}>Очистити вміст</button>
                    </div>
                </div>

                <div className="admin-section">
                    <h3>Ключові слова</h3>
                    <div className="keywords-list">
                        {keywords.map(kw => (
                            <span key={kw} className="keyword-chip">
                                {kw} <button onClick={() => removeKeyword(kw)}>×</button>
                            </span>
                        ))}
                    </div>
                    <div className="keyword-inputs">
                        <input 
                            type="text" 
                            className="admin-input small-input" 
                            placeholder="Нове слово..."
                            value={newKeyword}
                            onChange={(e) => setNewKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                        />
                        <button className="teal-btn" onClick={handleAddKeyword}>Додати</button>
                    </div>
                </div>

                <div className="save-action-area">
                    <button 
                        className="teal-btn large-save-btn" 
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Збереження..." : "Зберегти"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminBlogEdit;