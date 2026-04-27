import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const TOPICS = ['Для дому', 'Для саду', 'Для сну'];

const BLOG_CATEGORY_GROUPS = {
  'Для дому': [
    { id: 'living-room', label: 'Вітальня', image: '/images/blog-categories/home-living.png' },
    { id: 'kitchen', label: 'Кухня', image: '/images/blog-categories/home-kitchen.png' },
    { id: 'bedroom', label: 'Спальня', image: '/images/blog-categories/home-bedroom.png' },
    { id: 'bathroom', label: 'Ванна', image: '/images/blog-categories/home-bathroom.png' },
    { id: 'office', label: 'Кабінет', image: '/images/blog-categories/home-office.png' },
    { id: 'yard', label: 'Двір', image: '/images/blog-categories/home-yard.png' },
  ],
  'Для саду': [
    { id: 'balcony', label: 'Балкони та патіо', image: '/images/blog-categories/garden-balcony.png' },
    { id: 'outdoor', label: 'На свіжому повітрі', image: '/images/blog-categories/garden-outdoor.png' },
    { id: 'holidays', label: 'Свята', image: '/images/blog-categories/garden-holidays.png' },
    { id: 'care', label: 'Догляд', image: '/images/blog-categories/garden-care.png' },
  ],
  'Для сну': [
    { id: 'mattresses', label: 'Матраци та ліжка', image: '/images/blog-categories/sleep-mattress.png' },
    { id: 'blankets', label: 'Ковдри', image: '/images/blog-categories/sleep-blankets.png' },
    { id: 'pillows', label: 'Подушки', image: '/images/blog-categories/sleep-pillows.png' },
    { id: 'health', label: 'Здоров’я та алергії', image: '/images/blog-categories/sleep-health.png' },
    { id: 'advice', label: 'Поради для сну', image: '/images/blog-categories/sleep-advice.png' },
    { id: 'care', label: 'Догляд', image: '/images/blog-categories/sleep-care.png' },
  ],
};

const FALLBACK_SECTIONS = [
  {
    key: 'home',
    title: 'Для дому',
    posts: [
      {
        id: '1',
        title: 'Секрети довговічності: як доглядати за меблями з натурального дерева',
        coverImage: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=1200&q=80',
      },
      {
        id: '2',
        title: '10 трендів у дизайні інтер’єру 2026 року, які варто врахувати',
        coverImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80',
      },
      {
        id: '3',
        title: 'Як обрати ідеальні меблі для маленької квартири',
        coverImage: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=900&q=80',
      },
      {
        id: '4',
        title: 'Чому варто обрати модульні меблі: переваги та ідеї використання',
        coverImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80',
      },
      {
        id: '5',
        title: 'Нестандартні рішення: як меблі можуть змінити ваш простір',
        coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
      },
    ],
  },
  {
    key: 'garden',
    title: 'Для саду',
    posts: [
      {
        id: '6',
        title: 'Як вибрати стійкі меблі для саду: матеріали, які витримують погоду',
        coverImage: 'https://images.unsplash.com/photo-1585128792020-803d29415281?w=1200&q=80',
      },
      {
        id: '7',
        title: '5 ідей для облаштування комфортної зони відпочинку в саду',
        coverImage: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=900&q=80',
      },
      {
        id: 'garden-terrace',
        title: 'Садові аксесуари, які змінять ваше уявлення про відпочинок',
        coverImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=900&q=80',
      },
      {
        id: 'garden-breakfast',
        title: 'Як створити затишний куточок для сніданків на терасі',
        coverImage: 'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=900&q=80',
      },
      {
        id: 'garden-trends',
        title: 'Тренди садових меблів 2026 року',
        coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80',
      },
    ],
  },
  {
    key: 'sleep',
    title: 'Для сну',
    posts: [
      {
        id: 'kFa_UWK7ulo',
        title: 'Чому важливо звертати увагу на жорсткість матраца',
        coverImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
      },
      {
        id: 'sleep-mattress',
        title: 'Як обрати ідеальний матрац: поради для здорового сну',
        coverImage: 'https://images.unsplash.com/photo-1616627781431-23b776aad6d3?w=900&q=80',
      },
      {
        id: 'sleep-trends',
        title: 'Тренди у світі матраців 2026 року: які новинки варто спробувати',
        coverImage: 'https://images.unsplash.com/photo-1615874694520-474822394e73?w=900&q=80',
      },
      {
        id: 'sleep-health',
        title: 'Матраци для здоров’я: технології, що покращують якість сну',
        coverImage: 'https://images.unsplash.com/photo-1617098474202-0d0d7f60c56b?w=900&q=80',
      },
      {
        id: 'sleep-care',
        title: 'Догляд за матрацом: прості поради для тривалого використання',
        coverImage: 'https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=900&q=80',
      },
    ],
  },
];

const normalizeCategory = (category = '') => {
  if (category.includes('дому') || category.includes('РґРѕРј')) return 'Для дому';
  if (category.includes('саду') || category.includes('СЃР°Рґ')) return 'Для саду';
  if (category.includes('сну') || category.includes('СЃРЅ')) return 'Для сну';
  return category;
};

const mergeSectionPosts = (fallbackPosts, remotePosts) => {
  const usedIds = new Set();
  const posts = [];

  remotePosts.forEach((post, index) => {
    if (!post?.id || usedIds.has(String(post.id))) return;
    const fallback = fallbackPosts.find(item => String(item.id) === String(post.id)) || fallbackPosts[index];
    posts.push({
      ...fallback,
      ...post,
      title: fallback?.title || post.title,
      coverImage: post.coverImage || fallback?.coverImage,
    });
    usedIds.add(String(post.id));
  });

  fallbackPosts.forEach(post => {
    if (!usedIds.has(String(post.id))) {
      posts.push(post);
    }
  });

  return posts.slice(0, 5);
};

const BlogPage = () => {
  const [activeTopic, setActiveTopic] = useState('Для дому');
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/blogs')
      .then(res => (res.ok ? res.json() : []))
      .then(data => setBlogs(Array.isArray(data) ? data : []))
      .catch(() => setBlogs([]));
  }, []);

  const sections = useMemo(() => {
    return FALLBACK_SECTIONS.map(section => {
      const remotePosts = blogs
        .filter(blog => normalizeCategory(blog.mainCategory) === section.title)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

      return {
        ...section,
        posts: mergeSectionPosts(section.posts, remotePosts),
      };
    });
  }, [blogs]);

  const handleTopicClick = topic => {
    setActiveTopic(topic);
    document.getElementById(`blog-section-${topic}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <main className="blog-page">
      <div className="blog-page__container">
        <nav className="blog-breadcrumb" aria-label="Навігація">
          <Link to="/">Домашня сторінка</Link>
          <span aria-hidden="true">&gt;</span>
          <span>Блог</span>
        </nav>

        <header className="blog-hero">
          <h1>Блог</h1>
          <p>Ідеї за кімнатами</p>
        </header>

        <section className="blog-category-panel" aria-label="Категорії блогу">
          <div className="blog-topic-tabs">
            {TOPICS.map(topic => (
              <button
                key={topic}
                type="button"
                className={`blog-topic-tab ${activeTopic === topic ? 'is-active' : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                {topic}
              </button>
            ))}
          </div>

          <div className={`blog-room-grid blog-room-grid--count-${BLOG_CATEGORY_GROUPS[activeTopic].length}`}>
            {BLOG_CATEGORY_GROUPS[activeTopic].map(category => (
              <button key={category.id} type="button" className="blog-room-card">
                <span className="blog-room-card__image">
                  <img src={category.image} alt="" loading="lazy" />
                </span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      {sections.map(section => (
        <section
          key={section.key}
          id={`blog-section-${section.title}`}
          className="blog-section"
        >
          <h2>{section.title}</h2>
          <div className="blog-grid">
            {section.posts.map((post, index) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className={`blog-card ${index === 0 ? 'blog-card--large' : ''}`}
              >
                <img src={post.coverImage} alt="" loading="lazy" />
                <span className="blog-card__shade" aria-hidden="true" />
                <span className="blog-card__title">{post.title}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
};

export default BlogPage;
