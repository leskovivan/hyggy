import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './WorkPage.css';

const heroImage = '/images/work/work-hero.png';

const introParagraphs = [
  'Ми - сучасний і динамічний інтернет-магазин, який активно зростає та шукає талановитих і мотивованих людей. Якщо ти готовий долучитися до команди, що рухає інновації та обслуговує клієнтів на найвищому рівні, ми будемо раді вітати тебе серед нас! Ми цінуємо професійний розвиток наших співробітників. Пропонуємо навчання, тренінги та можливість кар’єрного зростання у різних напрямках - від обслуговування клієнтів до IT і маркетингу. Ми цінуємо внесок кожного члена нашої команди, тому пропонуємо конкурентну оплату праці та систему бонусів за результативну роботу.',
  'Наш інтернет-магазин спеціалізується на продажі товарів для дому, меблів та декору. Ми прагнемо надавати нашим клієнтам широкий вибір високоякісної продукції за доступними цінами. Завдяки постійній орієнтації на потреби споживачів та впровадженню новітніх технологій, ми стали одним із лідерів ринку. Наші головні цінності - це довіра, інновації та сервіс, орієнтований на клієнта. Ми працюємо для того, щоб кожен покупець отримував найкращий досвід покупок, а кожен працівник - можливість для особистого та професійного розвитку.',
];

const pillars = [
  { type: 'globe', title: 'МІЖНАРОДНІ МОЖЛИВОСТІ' },
  { type: 'growth', title: 'СТРІМКА КАР’ЄРА' },
  { type: 'team', title: 'КОМАНДНИЙ ДУХ' },
];

const cards = [
  { title: 'РІТЕЙЛ', image: '/images/work/work-retail-card.png' },
  { title: 'КОНТАКТИ', image: '/images/work/work-contacts.png' },
  { title: 'ГОЛОВНИЙ ОФІС', image: '/images/work/work-office-card.png' },
];

const socialLinks = [
  { label: 'Telegram', icon: '/images/telegram.svg', href: '#' },
  { label: 'Instagram', icon: '/images/instagram.svg', href: '#' },
  { label: 'Facebook', icon: '/images/facebook.png', href: '#' },
  { label: 'YouTube', icon: '/images/youtube.svg', href: '#' },
];

const bannerText = 'Ми віримо в потенціал кожного члена нашої команди. У нас ти зможеш постійно вдосконалювати свої навички, відвідувати тренінги, брати участь у внутрішніх програмах навчання та розвивати свою кар’єру. Ми підтримуємо ініціативи та заохочуємо досягнення. Розвивайся в напрямках, які тобі цікаві - від клієнтського сервісу до логістики, від маркетингу до IT-рішень. Ми розуміємо, наскільки важливо підтримувати баланс між роботою та особистим життям.';

const vacancies = [
  {
    id: 'retail',
    title: 'РОБОТА В РІТЕЙЛІ',
    text: 'Живий контакт із клієнтами, турбота про простір магазину та швидкі рішення - це робота для тих, хто любить рух і результат. Ми навчаємо стандартам сервісу, допомагаємо розібратися з продуктом і підтримуємо на кожному етапі. Тут легко побачити, як твоя увага до деталей перетворюється на довіру покупців. У команді рітейлу ти щодня працюєш з людьми, товарами та атмосферою HYGGY.',
    image: '/images/work/work-office.png',
  },
  {
    id: 'office',
    title: 'РОБОТА В ГОЛОВНОМУ ОФІСІ',
    text: 'У головному офісі ти працюватимеш із процесами, які рухають бізнес вперед: логістика, маркетинг, фінанси, аналітика, контент і IT. Ми цінуємо системність, відповідальність і сміливі ідеї. Тут є простір для ініціативи, командної взаємодії та реального впливу на розвиток HYGGY. Твої рішення допомагають магазинам, клієнтам і всій команді працювати краще щодня.',
    image: '/images/work/work-support.png',
    reverse: true,
  },
  {
    id: 'support',
    title: 'РОБОТА У ВІДДІЛІ ПО РОБОТІ З КЛІЄНТАМИ',
    text: 'Цей напрям для людей, які люблять допомагати та будувати якісний сервіс. Ти відповідатимеш на запити клієнтів, допомагатимеш із вибором, замовленнями та післяпродажною підтримкою. Ми даємо зрозумілі процеси, сучасні інструменти і команду, яка не залишає наодинці зі складними ситуаціями. Головне - уважність, спокій і бажання знаходити рішення.',
    image: '/images/work/work-office.png',
  },
];

function WorkPage() {
  return (
    <main className="work-page">
      <section className="work-page__container work-page__breadcrumbs">
        <Breadcrumb customLabels={{ work: 'Робота' }} />
      </section>

      <section className="work-page__container work-page__hero">
        <img src={heroImage} alt="Працюй з нами" className="work-page__hero-img" />
        <h1 className="work-page__title">Працюй з нами</h1>
      </section>

      <section className="work-page__container work-page__intro">
        {introParagraphs.map((paragraph) => (
          <p className="work-page__intro-text" key={paragraph}>{paragraph}</p>
        ))}
      </section>

      <section className="work-page__pillars" aria-label="Переваги роботи">
        <div className="work-page__container work-page__pillars-grid">
          {pillars.map((pillar) => (
            <article className="work-page__pillar" key={pillar.title}>
              <div className={`work-page__icon work-page__icon--${pillar.type}`} aria-hidden="true" />
              <h2 className="work-page__pillar-title">{pillar.title}</h2>
            </article>
          ))}
        </div>
      </section>

      <section className="work-page__container work-page__cards" aria-label="Напрями роботи">
        {cards.map((card) => (
          <article className="work-page__card" key={card.title}>
            <img src={card.image} alt="" className="work-page__card-image" />
            <div className="work-page__card-mask" />
            <h3 className="work-page__card-title">{card.title}</h3>
          </article>
        ))}
      </section>

      <section className="work-page__container work-page__banner">
        <h2 className="work-page__banner-title">ЗНАЙДИ РОБОТУ, ЯКУ ТИ ШУКАЄШ</h2>
        <p className="work-page__banner-text">{bannerText}</p>
      </section>

      <section className="work-page__container work-page__vacancies" aria-label="Вакансії">
        {vacancies.map((vacancy) => (
          <article
            className={`work-page__vacancy${vacancy.reverse ? ' work-page__vacancy--reverse' : ''}`}
            id={vacancy.id}
            key={vacancy.title}
          >
            <div className="work-page__vacancy-content">
              <h3 className="work-page__vacancy-title">{vacancy.title}</h3>
              <p className="work-page__vacancy-text">{vacancy.text}</p>
            </div>
            <img src={vacancy.image} alt="" className="work-page__vacancy-image" />
          </article>
        ))}
      </section>

      <section className="work-page__container work-page__banner work-page__banner--last">
        <h2 className="work-page__banner-title">ПРИЄДНУЙСЯ ДО НАШОЇ КОМАНДИ І ПРАЦЮЙ З НАМИ</h2>
        <p className="work-page__banner-text">
          Ми віримо в потенціал кожного члена нашої команди. У нас ти зможеш постійно вдосконалювати свої навички, брати участь у внутрішніх програмах навчання та розвивати свою кар’єру. Ми підтримуємо ініціативи, заохочуємо досягнення та допомагаємо знайти напрямок, у якому хочеться рости.
        </p>
      </section>

      <section className="work-page__social" aria-label="Соціальні мережі">
        <div className="work-page__social-inner">
          {socialLinks.map((link) => (
            <a className="work-page__social-link" href={link.href} aria-label={link.label} key={link.label}>
              <img src={link.icon} alt="" className="work-page__social-icon" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default WorkPage;
