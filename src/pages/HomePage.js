import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

// ІМПОРТИ КАРТИНОК ВИДАЛЕНО, ТЕПЕР ВОНИ БЕРУТЬСЯ ПРЯМО З ПАПКИ PUBLIC

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
    description: 'Бренд, відомий своїми розкішними матрацами, які роблять із натуральних матеріалів з акцентом на якість та комфорт.',
  },
  {
    logo: '/images/Svenska.png',
    description: 'Бренд пропонує широкий вибір меблів та товарів для дому, що поєднують стиль та функціональність.',
  },
  {
    logo: '/images/Fritz.png',
    description: 'Знаменита меблева компанія, що виробляє дизайнерські меблі та аксесуари, включаючи культові вироби від відомих дизайнерів.',
  },
  {
    logo: '/images/muuto.png',
    description: 'Пропонує сучасні меблі, освітлення та аксесуари з акцентом на скандинавський дизайн та простоту.',
  },
];

const BLOG_POSTS = [
  {
    title: 'Створіть Затишний Дім: 5 Порад з Вибору Меблів для Різних Кімнат',
    image: 'https://www.figma.com/api/mcp/asset/eff7d515-bfad-4075-a615-b63c08a88bb8',
    description: 'Вибір меблів для вашого будинку – це не тільки питання стилю, але й комфорту та функціональності. У цьому пості ми розповімо, як підібрати ідеальні предмети для кожної кімнати вашого будинку, щоб створити затишний та гармонійний простір.',
    titleAlign: 'left',
    textAlign: 'left',
  },
  {
    title: 'Як Правильно Вибрати Освітлення для Різних Кімнат Вашої оселі',
    image: 'https://www.figma.com/api/mcp/asset/de25d78a-b833-46c2-8d20-a59c1e79ab9d',
    description: 'Освітлення відіграє ключову роль у створенні комфортної атмосфери у вашому будинку. Правильно підібране освітлення не тільки підкреслює стиль інтер’єру, але й впливає на ваш настрій. Ми розповімо, як вибрати освітлення для кожної кімнати вашого будинку, щоб створити ідеальну атмосферу.',
    titleAlign: 'right',
    textAlign: 'right',
  },
  {
    title: 'Меблі для кожної кімнати: як обрати стиль і комфорт',
    image: 'https://www.figma.com/api/mcp/asset/8368a2fc-0bed-4516-bda0-590deddcf181',
    description: 'У цій статті ми поговоримо про те, як підібрати меблі для різних приміщень вашого дому, орієнтуючись на функціональність і естетику. Ви дізнаєтесь, як правильно вибрати меблі для вітальні, спальні, кухні та кабінету, враховуючи стиль інтер’єру, розмір приміщення та ваші особисті потреби.',
    titleAlign: 'right',
    textAlign: 'right',
  },
  {
    title: 'Тренди в меблевому дизайні: що буде в моді у 2024 році?',
    image: 'https://www.figma.com/api/mcp/asset/27c217e5-499a-4dc6-8328-16a2331ea773',
    description: 'Меблевий дизайн не стоїть на місці, і щороку з’являються нові тенденції, які змінюють вигляд наших домівок. У цій статті ми розглянемо основні тренди в меблях на 2024 рік. Відновлені матеріали, інноваційні технології та новітні рішення у функціональності.',
    titleAlign: 'left',
    textAlign: 'right',
  },
];

const BLOG_ARROW_LEFT = 'https://www.figma.com/api/mcp/asset/0283f744-4da6-442f-aece-6c2dfeb197b7';
const BLOG_ARROW_RIGHT = 'https://www.figma.com/api/mcp/asset/e8b7fdcf-6cb7-4d09-ba31-ab7b3fe7098f';

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
      <div className='home-page-color'>
        <section className="home-page__hero">
          {/* ТУТ ЗАМІНЕНО HERO_IMAGE */}
          <img className="home-page__hero-image" src="/images/HERO_IMAGE.png" alt="Осіння акція HYGGY" />
          <div className="home-page__hero-overlay">
            <h1 className="home-page__hero-title">Осінь на вашому боці: Знижки до 50% на меблі! Змініть свій інтер&apos;єр зараз!</h1>
          </div>
        </section>

        <section className="home-page__section home-page__about">
          <div className="home-page__section-title-wrap home-page__section-title-wrap--about">
          </div>

          <div className="home-page__about-grid">
            <div className="home-page__about-image-wrap">
              {/* ТУТ ЗАМІНЕНО ABOUT_US */}
              <img className="home-page__about-image" src="/images/about_us.png" alt="Інтер’єр HYGGY" />
            </div>

            <div className="home-page__about-text">
              <h2 >Про нас</h2>
              <p>
                У Hyggy ми робимо все можливе, щоб ваш будинок став більш затишним та стильним. Ми пропонуємо ретельно відібрані меблі від надійних виробників, забезпечуючи відмінну якість та сучасний дизайн. Наша мета – надати вам широкий вибір, який відповідає різним смакам та бюджетам. Ми пишаємось тим, що наш асортимент включає як класичні, так і сучасні рішення для будь-якого інтер&apos;єру. Ми розуміємо, що купівля меблів – це важлива подія, і прагнемо зробити цей процес простим та приємним. Наша команда професіоналів завжди готова допомогти вам з вибором та відповісти на будь-які питання.
              </p>
              <p>
                Ми приділяємо особливу увагу кожному клієнту, щоб ви могли знайти те, що вам потрібно. У Hyggy ми прагнемо створити ідеальні умови для комфортного та стильного проживання.
              </p>
            </div>
          </div>
        </section>

        <section className="home-page__section home-page__categories">
          <div className="home-page__section-title-wrap home-page__section-title-wrap--compact categories">
            <h2 className="home-page__section-title "><Link key="categories" to={`/category`} className="">Категорії</Link></h2>
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

        <section className="home-page__brands">
          <div className="home-page__section home-page__brands-grid">
            {BRAND_CARDS.map((brand) => (
              <article key={brand.description} className="home-page__brand-card">
                <img className="home-page__brand-logo" src={brand.logo} alt="Логотип бренду" />
                <p className="home-page__brand-text">{brand.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-page__section home-page__blog">
          <div className="home-page__section-title-wrap home-page__section-title-wrap--compact">
            <h2 className="home-page__section-title">Блог</h2>
          </div>

          <div className="home-page__blog-carousel">
            <button
              type="button"
              className="home-page__carousel-arrow home-page__carousel-arrow--left"
              aria-label="Попередні записи"
              onClick={handlePrevBlog}
            >
              <img src={BLOG_ARROW_LEFT} alt="Попередній слайд" className="home-page__carousel-arrow-icon" />
            </button>

            <div className="home-page__blog-track" aria-label="Блог статті">
              {visibleBlogPosts.map((post) => (
                <article key={post.title} className="home-page__blog-card">
                  <div className="home-page__blog-image-wrap">
                    <img className="home-page__blog-image" src={post.image} alt={post.title} />
                    <h3 className={`home-page__blog-title home-page__blog-title--${post.titleAlign}`}>{post.title}</h3>
                  </div>
                  <p className={`home-page__blog-text home-page__blog-text--${post.textAlign}`}>{post.description}</p>
                  <Link to="/blog" className="home-page__blog-more" data-node-id="1750:136">
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
              <img src={BLOG_ARROW_RIGHT} alt="Наступний слайд" className="home-page__carousel-arrow-icon" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;