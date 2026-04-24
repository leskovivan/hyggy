import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb'; // Перевір, чи правильний шлях до твого компонента
import './BlogPost.css';

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:3001/blogs/${id}`)
            .then(res => res.json())
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Помилка:", err);
                setLoading(false);
            });
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div className="post-loader">Завантаження...</div>;
    if (!post) return <div className="post-error">Статтю не знайдено :(</div>;

    return (
        <div className="blog-post-page">
            <div className="post-container">
                
                {/* ТВІЙ РОЗУМНИЙ BREADCRUMB */}
                {/* Передаємо id статті як ключ, а назву статті як значення */}
                <div style={{ marginBottom: '30px' }}>
                    <Breadcrumb customLabels={{ [id]: post.title }} />
                </div>

                {/* Навігація назад (опціонально, можна прибрати, якщо Breadcrumb достатньо) */}
                <Link to="/blog" className="back-link">← Назад до блогу</Link>

                {/* Головний заголовок */}
                <h1 className="post-main-title">{post.title}</h1>

                {/* --- АБСТРАКТНИЙ РЕНДЕР КОНТЕНТУ --- */}
                <div className="post-content-body">
                    {post.content && post.content.map((block, index) => {
                        
                        // 1. ПІДЗАГОЛОВОК
                        if (block.type === 'heading') {
                            return <h2 key={index} className="content-heading">{block.value}</h2>;
                        }
                        
                        // 2. ТЕКСТ
                        if (block.type === 'text') {
                            return <p key={index} className="content-text">{block.value}</p>;
                        }
                        
                        // 3. ГАЛЕРЕЯ (Розумна сітка)
                        if (block.type === 'gallery' && block.images) {
                            return (
                                <div 
                                    key={index} 
                                    className="content-gallery"
                                    style={{ gridTemplateColumns: `repeat(${block.images.length}, 1fr)` }}
                                >
                                    {block.images.map((img, imgIndex) => (
                                        <div key={imgIndex} className="gallery-image-wrapper">
                                            <img src={img} alt={`Gallery ${index}-${imgIndex}`} />
                                        </div>
                                    ))}
                                </div>
                            );
                        }

                        // Одиничне фото
                        if (block.type === 'image') {
                            return (
                                <div key={index} className="content-single-image">
                                    <img src={block.value} alt={`Block ${index}`} />
                                </div>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

export default BlogPost;