import React from 'react';
import { Link } from 'react-router-dom';
import './RelatedBlogs.css';

const RelatedBlogs = ({ blogs }) => {
  if (!blogs || blogs.length === 0) return null;

  return (
    <div className="related-blogs">
      <h3 className="related-blogs-title">Пов'язані статті в блозі</h3>
      <div className="related-blogs-grid">
        {blogs.map(blog => (
          <Link to={`/blog/${blog.id}`} key={blog.id} className="related-blog-card">
            <span className="related-blog-image">
              <img src={blog.coverImage} alt="" loading="lazy" />
            </span>
            <span className="related-blog-title">{blog.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
