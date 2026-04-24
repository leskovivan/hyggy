import React from 'react';
import { Link } from 'react-router-dom';

const RelatedBlogs = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="feature-grid-extra">
      <h3 className="extra-title">Пов'язані статті в блозі</h3>
      <div className="extra-cards-row">
        {blogs.map(blog => (
          <Link to={`/blog/${blog.id}`} key={blog.id} className="extra-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="blog-image-wrapper" style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden', borderRadius: '4px' }}>
              <img 
                // Змінюємо blog.image на blog.coverImage
                src={blog.coverImage} 
                alt={blog.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                // Додаємо обробку помилки, якщо шлях відносний
                onError={(e) => {
                   if (!e.target.src.includes('http') && !blog.coverImage.startsWith('/')) {
                      e.target.src = `/${blog.coverImage}`;
                   }
                }}
              />
            </div>
            <p style={{ marginTop: '10px', fontSize: '14px', fontWeight: '500', lineHeight: '1.4' }}>
              {blog.title}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;