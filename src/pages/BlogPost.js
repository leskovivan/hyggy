import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './BlogPost.css';

const isFilledString = value => typeof value === 'string' && value.trim().length > 0;

const normalizeContent = content => (Array.isArray(content) ? content : []);

const getTextParagraphs = value => {
  if (!isFilledString(value)) return [];
  return value
    .split(/\n{2,}/)
    .map(part => part.trim())
    .filter(Boolean);
};

function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetch(`http://localhost:3001/blogs/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Blog post not found');
        return res.json();
      })
      .then(data => {
        if (isMounted) setPost(data && Object.keys(data).length ? data : null);
      })
      .catch(() => {
        if (isMounted) setPost(null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    window.scrollTo(0, 0);

    return () => {
      isMounted = false;
    };
  }, [id]);

  const content = useMemo(() => normalizeContent(post?.content), [post]);
  const hasBody = content.some(block => {
    if (block.type === 'gallery') return Array.isArray(block.images) && block.images.length > 0;
    return isFilledString(block.value);
  });
  const hasContentImage = content.some(block => {
    if (block.type === 'image') return isFilledString(block.value);
    if (block.type === 'gallery') return Array.isArray(block.images) && block.images.some(Boolean);
    return false;
  });

  if (loading) {
    return (
      <main className="blog-post-page">
        <div className="blog-post-state">Завантаження...</div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="blog-post-page">
        <div className="blog-post-state">
          <h1>Статтю не знайдено</h1>
          <Link to="/blog">Повернутися до блогу</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="blog-post-page">
      <article className="blog-post">
        <nav className="blog-post-breadcrumb" aria-label="Навігація">
          <Link to="/">Домашня сторінка</Link>
          <span aria-hidden="true">&gt;</span>
          <Link to="/blog">Блог</Link>
          <span aria-hidden="true">&gt;</span>
          <span>{post.title}</span>
        </nav>

        <header className="blog-post-header">
          {isFilledString(post.mainCategory) && (
            <p className="blog-post-category">{post.mainCategory}</p>
          )}
          <h1>{post.title}</h1>
          {Array.isArray(post.keywords) && post.keywords.length > 0 && (
            <div className="blog-post-tags" aria-label="Ключові слова">
              {post.keywords.map(keyword => (
                <span key={keyword}>{keyword}</span>
              ))}
            </div>
          )}
        </header>

        {!hasContentImage && isFilledString(post.coverImage) && (
          <figure className="blog-post-cover">
            <img src={post.coverImage} alt="" />
          </figure>
        )}

        <div className="blog-post-content">
          {hasBody ? (
            content.map((block, index) => (
              <ContentBlock block={block} index={index} key={block.id || index} />
            ))
          ) : (
            <p className="blog-post-empty">Матеріал для цієї статті ще готується.</p>
          )}
        </div>
      </article>
    </main>
  );
}

function ContentBlock({ block, index }) {
  if (!block) return null;

  if (block.type === 'heading' && isFilledString(block.value)) {
    return <h2 className="blog-content-heading">{block.value}</h2>;
  }

  if (block.type === 'text') {
    const paragraphs = getTextParagraphs(block.value);
    if (!paragraphs.length) return null;

    return paragraphs.map((paragraph, paragraphIndex) => (
      <p className="blog-content-text" key={`${index}-${paragraphIndex}`}>
        {paragraph}
      </p>
    ));
  }

  if (block.type === 'gallery' && Array.isArray(block.images) && block.images.length > 0) {
    return (
      <div className="blog-content-gallery">
        {block.images.filter(Boolean).map((image, imageIndex) => (
          <figure className="blog-content-gallery__item" key={`${image}-${imageIndex}`}>
            <img src={image} alt="" loading="lazy" />
          </figure>
        ))}
      </div>
    );
  }

  if (block.type === 'image' && isFilledString(block.value)) {
    return (
      <figure className="blog-content-image">
        <img src={block.value} alt="" loading="lazy" />
      </figure>
    );
  }

  return null;
}

export default BlogPost;
