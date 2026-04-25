import React from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './WorkPage.css';

const heroImage = '/images/main_sale.png';

const introParagraphs = [
  "Ми – сучасний і динамічний інтернет-магазин, який активно зростає та шукає талановитих і мотивованих людей. Якщо ти готовий долучитися до команди, що рухає інновації та обслуговує клієнтів на найвищому рівні, ми будемо раді вітати тебе серед нас! Ми цінуємо професійний розвиток наших співробітників, пропонуємо навчання, тренінги та можливість кар’єрного зростання.",
  "Наш інтернет-магазин спеціалізується на продажі товарів для дому, меблів та декору. Ми прагнемо надавати клієнтам широкий вибір якісної продукції за доступними цінами. Наші головні цінності – довіра, інновації та сервіс, орієнтований на клієнта. Ми працюємо для того, щоб кожен покупець отримував найкращий досвід покупок, а кожен працівник – можливість для особистого й професійного розвитку."
];

const pillars = [
  { type: 'globe', title: 'МІЖНАРОДНІ МОЖЛИВОСТІ' },
  { type: 'growth', title: 'СТРІМКА КАРʼЄРА' },
  { type: 'team', title: 'КОМАНДНИЙ ДУХ' }
];

const cards = [
  { title: 'РІТЕЙЛ', image: '/images/bedroom.png' },
  { title: 'КОНТАКТИ', image: '/images/Garden.png' },
  { title: 'ГОЛОВНИЙ ОФІС', image: '/images/office.png' }
];

const vacancies = [
  {
    title: 'РОБОТА В РІТЕЙЛІ',
    text: 'Ти працюватимеш у середовищі, де цінують ініціативу, швидкість рішень і живу взаємодію з клієнтами. Ми пропонуємо системне навчання, підтримку наставника та прозорі умови розвитку. Конкурентна оплата, бонуси за результат і командна підтримка допоможуть рухатися вперед.',
    image: '/images/office.png',
    reverse: false
  },
  {
    title: 'РОБОТА В ГОЛОВНОМУ ОФІСІ',
    text: 'У головному офісі ти впливатимеш на ключові бізнес-процеси: від логістики та аналітики до маркетингу й IT. Тут цінують відповідальність, системність та нові ідеї. Ми даємо ресурси для реалізації ініціатив і можливість бачити реальний результат своєї роботи.',
    image: '/images/about_us.png',
    reverse: true
  },
  {
    title: 'РОБОТА У ВІДДІЛІ ПО РОБОТІ З КЛІЄНТАМИ',
    text: 'Це напрям для тих, хто любить допомагати людям та будувати якісний сервіс. Ти вирішуватимеш запити клієнтів, покращуватимеш їхній досвід та впливатимеш на лояльність до бренду. Ми забезпечуємо зрозумілі процеси, сучасні інструменти й дружню команду.',
    image: '/images/HERO_IMAGE.png',
    reverse: false
  }
];

function WorkPage() {
  return (
    <main className="work-page">
      <section className="work-page__container work-page__breadcrumbs">
        <Breadcrumb />
      </section>

      <section className="work-page__container work-page__hero">
        <img src={heroImage} alt="Працюй з нами" className="work-page__hero-img" />
        <h1 className="work-page__title">Працюй з нами</h1>
      </section>

      <section className="work-page__container work-page__intro">
        {introParagraphs.map((paragraph, index) => (
          <p className="work-page__intro-text" key={index}>{paragraph}</p>
        ))}
      </section>

      <section className="work-page__pillars">
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
            <img src={card.image} alt={card.title} className="work-page__card-image" />
            <div className="work-page__card-mask" />
            <h3 className="work-page__card-title">{card.title}</h3>
          </article>
        ))}
      </section>

      <section className="work-page__container work-page__banner">
        <h2 className="work-page__banner-title">ЗНАЙДИ РОБОТУ, ЯКУ ТИ ШУКАЄШ</h2>
        <p className="work-page__banner-text">
          Ми віримо в потенціал кожного члена нашої команди. У нас ти зможеш постійно вдосконалювати свої навички,
          брати участь у внутрішніх програмах навчання та розвивати кар’єру. Ми підтримуємо ініціативи, заохочуємо
          досягнення та дбаємо про баланс між роботою й особистим життям.
        </p>
      </section>

      <section className="work-page__container work-page__vacancies" aria-label="Вакансії">
        {vacancies.map((vacancy) => (
          <article
            key={vacancy.title}
            className={`work-page__vacancy${vacancy.reverse ? ' work-page__vacancy--reverse' : ''}`}
          >
            <div className="work-page__vacancy-content">
              <h3 className="work-page__vacancy-title">{vacancy.title}</h3>
              <p className="work-page__vacancy-text">{vacancy.text}</p>
            </div>
            <img src={vacancy.image} alt={vacancy.title} className="work-page__vacancy-image" />
          </article>
        ))}
      </section>

      <section className="work-page__container work-page__banner work-page__banner--last">
        <h2 className="work-page__banner-title">ПРИЄДНУЙСЯ ДО НАШОЇ КОМАНДИ І ПРАЦЮЙ З НАМИ</h2>
        <p className="work-page__banner-text">
          Розвивайся в напрямах, які тобі цікаві: від клієнтського сервісу до логістики, від маркетингу до IT-рішень.
          Ми цінуємо людей, які підтримують команду й хочуть рости разом із компанією.
        </p>
      </section>
    </main>
  );
}

export default WorkPage;