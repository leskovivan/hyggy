import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const CATEGORY_CARDS = [
  { title: 'Спальня', slug: 'bedroom', image: '/images/bedroom.png' },
  { title: 'Ванна', slug: 'bathroom', image: '/images/bathroom.png' },
  { title: 'Офіс', slug: 'office', image: '/images/office.png' },
  { title: 'Вітальня', slug: 'living-room', image: '/images/vitalynia.png' },
  { title: 'Кухня', slug: 'kitchen', image: '/images/kitchen.png' },
  { title: 'Для саду', slug: 'garden', image: '/images/Garden.png' },
];

const BRAND_CARDS = [
  {
    logo: '/images/Hastens.png',
    alt: 'Hastens',
    description: 'Бренд, відомий своїми розкішними матрацами, які роблять із натуральних матеріалів з акцентом на якість та комфорт.',
  },
  {
    logo: '/images/Svenska.png',
    alt: 'Svenska',
    description: 'Бренд пропонує широкий вибір меблів та товарів для дому, що поєднують стиль та функціональність.',
  },
  {
    logo: '/images/Fritz.png',
    alt: 'Fritz Hansen',
    description: 'Знаменита меблева компанія, що виробляє дизайнерські меблі та аксесуари, включаючи культові вироби від відомих дизайнерів.',
  },
  {
    logo: '/images/muuto.png',
    alt: 'Muuto',
    description: 'Пропонує сучасні меблі, освітлення та аксесуари з акцентом на скандинавський дизайн та простоту.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Створіть затишний дім: 5 порад з вибору меблів для різних кімнат',
    image: '/images/bedroom.png',
    description: 'Вибір меблів для вашого будинку - це не тільки питання стилю, але й комфорту та функціональності. У цьому пості ми розповімо, як підібрати ідеальні предмети для кожної кімнати вашого будинку, щоб створити затишний та гармонійний простір.',
    titleAlign: 'left',
    textAlign: 'left',
  },
  {
    title: 'Як правильно вибрати освітлення для різних кімнат вашої оселі',
    image: '/images/office.png',
    description: 'Освітлення відіграє ключову роль у створенні комфортної атмосфери у вашому будинку. Правильно підібране освітлення не тільки підкреслює стиль інтер’єру, але й впливає на ваш настрій.',
    titleAlign: 'right',
    textAlign: 'right',
  },
  {
    title: 'Меблі для кожної кімнати: як обрати стиль і комфорт',
    image: '/images/about_us.png',
    description: 'У цій статті ми поговоримо про те, як підібрати меблі для різних приміщень вашого дому, орієнтуючись на функціональність і естетику.',
    titleAlign: 'right',
    textAlign: 'right',
  },
  {
    title: 'Тренди в меблевому дизайні: що буде в моді у 2024 році?',
    image: '/images/kitchen.png',
    description: 'Меблевий дизайн не стоїть на місці, і щороку з’являються нові тенденції, які змінюють вигляд наших домівок.',
    titleAlign: 'left',
    textAlign: 'right',
  },
];

function HomePage() {
  const [blogStartIndex, setBlogStartIndex] = useState(0);

  const handlePrevBlog = () => {
    setBlogStartIndex((prev) => (prev - 1 + BLOG_POSTS.length) % BLOG_POSTS.length);
  };

  const handleNextBlog = () => {
    setBlogStartIndex((prev) => (prev + 1) % BLOG_POSTS.length);
  };

  const visibleBlogPosts = [
    BLOG_POSTS[blogStartIndex],
    BLOG_POSTS[(blogStartIndex + 1) % BLOG_POSTS.length],
  ];

  return (
    <main className="home-page">
      <section className="home-page__hero" aria-label="Акція">
        <img className="home-page__hero-image" src="/images/HERO_IMAGE.png" alt="Осіння акція HYGGY" />
        <div className="home-page__hero-overlay">
          <h1 className="home-page__hero-title">
            Осінь на вашому боці: Знижки до 50% на меблі! Змініть свій інтер'єр зараз!
          </h1>
        </div>
      </section>

      <section className="home-page__section home-page__about">
        <div className="home-page__about-grid">
          <div className="home-page__about-image-wrap">
            <img className="home-page__about-image" src="/images/about_us.png" alt="Інтер’єр HYGGY" />
          </div>

          <div className="home-page__about-text">
            <h2>Про нас</h2>
            <p>
              У Hyggy ми робимо все можливе, щоб ваш будинок став більш затишним та стильним. Ми пропонуємо ретельно відібрані меблі від надійних виробників, забезпечуючи відмінну якість та сучасний дизайн. Наша мета - надати вам широкий вибір, який відповідає різним смакам та бюджетам.
            </p>
            <p>
              Ми пишаємось тим, що наш асортимент включає як класичні, так і сучасні рішення для будь-якого інтер'єру. Наша команда професіоналів завжди готова допомогти вам з вибором та відповісти на будь-які питання.
            </p>
          </div>
        </div>
      </section>

      <section className="home-page__section home-page__categories">
        <div className="home-page__section-title-wrap">
          <h2 className="home-page__section-title">
            <Link to="/category">Категорії</Link>
          </h2>
        </div>

        <div className="home-page__categories-grid">
          {CATEGORY_CARDS.map((category) => (
            <Link key={category.title} to={`/category/${category.slug}`} className="home-page__category-card">
              <img className="home-page__category-image" src={category.image} alt={category.title} />
              <span className="home-page__category-label">{category.title}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-page__brands" aria-label="Бренди">
        <div className="home-page__brands-grid">
          {BRAND_CARDS.map((brand) => (
            <article key={brand.alt} className="home-page__brand-card">
              <div className="home-page__brand-logo-wrap">
                <img className="home-page__brand-logo" src={brand.logo} alt={brand.alt} />
              </div>
              <p className="home-page__brand-text">{brand.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-page__section home-page__blog">
        <div className="home-page__section-title-wrap">
          <h2 className="home-page__section-title">Блог</h2>
        </div>

        <div className="home-page__blog-carousel">
          <button
            type="button"
            className="home-page__carousel-arrow home-page__carousel-arrow--left"
            aria-label="Попередні записи"
            onClick={handlePrevBlog}
          >
            <span />
          </button>

          <div className="home-page__blog-track" aria-label="Блог статті">
            {visibleBlogPosts.map((post, index) => (
              <article key={post.title} className="home-page__blog-card">
                <div className="home-page__blog-image-wrap">
                  <img className="home-page__blog-image" src={post.image} alt={post.title} />
                  <h3 className={`home-page__blog-title home-page__blog-title--${post.titleAlign}`}>{post.title}</h3>
                </div>
                <p className={`home-page__blog-text home-page__blog-text--${post.textAlign}`}>{post.description}</p>
                <Link to="/blog" className={`home-page__blog-more home-page__blog-more--${index === 0 ? 'left' : 'right'}`}>
                  Детальніше
                </Link>
              </article>
            ))}
          </div>

          <button
            type="button"
            className="home-page__carousel-arrow home-page__carousel-arrow--right"
            aria-label="Наступні записи"
            onClick={handleNextBlog}
          >
            <span />
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
