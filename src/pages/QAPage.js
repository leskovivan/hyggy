import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import './QAPage.css';

const qaGroups = [
  {
    title: "Питання пов'язані з онлайн замовленнями",
    questions: [
      'Як я можу змінити замовлення?',
      'Як я можу скасувати замовлення?',
      'Я не отримав підтвердження замовлення або рахунок-фактуру',
      'Магазин не проінформував мене, що я можу забрати замовлення',
      'Якими варіантами оплати я можу скористатися на сайті?',
      'Як довго моє замовлення «Замов та Забери» залишається зарезервованим?',
      'Де я можу використати свою подарункову картку?',
    ],
  },
  {
    title: 'Перевезення та доставка',
    questions: [
      'Які варіанти доставки доступні для замовлень?',
      'Скільки часу займає доставка моєї покупки?',
      'Як я можу відстежувати статус свого замовлення?',
      'Чи можу я змінити адресу доставки?',
      'Що робити, якщо кур’єр не зміг доставити замовлення?',
    ],
  },
  {
    title: 'Повернення та претензії',
    questions: [
      'Які умови повернення товарів, якщо вони не підійшли?',
      'Що робити, якщо товар прибув пошкодженим?',
      'Скільки часу займає повернення коштів?',
      'Чи можна повернути товар, куплений онлайн, у магазині?',
    ],
  },
  {
    title: 'Питання стосовно продукції',
    questions: [
      'Які матеріали використовуються для виготовлення вашої продукції?',
      'Чи надаєте ви послуги складання меблів?',
      'Як перевірити наявність товару?',
      'Де знайти інструкцію зі складання?',
    ],
  },
  {
    title: 'Питання пов’язані з магазинами та замовленнями із магазинів',
    questions: [
      'Як я можу знайти найближчий до мене магазин?',
      'Чи можу я замовити товар в магазині, а забрати його самостійно?',
      'Як дізнатися графік роботи магазину?',
      'Чи є можливість отримати знижку при великому замовленні?',
    ],
  },
];

const commonQuestions = [
  'Як я можу зробити замовлення в вашому інтернет-магазині?',
  'Чи можу я змінити або скасувати своє замовлення після його оформлення?',
  'Які варіанти доставки доступні для замовлень?',
  'Скільки часу займе доставка моєї покупки?',
  'Як я можу відстежувати статус свого замовлення?',
  'Які умови повернення товарів, якщо вони не підійшли?',
  'Що робити, якщо товар прибув пошкодженим?',
  'Які матеріали використовуються для виготовлення вашої продукції?',
  'Як я можу знайти найближчий до мене магазин, що продає ваші меблі?',
  'Чи можу я замовити товар в магазині, а забрати його самостійно?',
  'Чи надаєте ви послуги складання меблів?',
  'Які методи оплати ви приймаєте?',
  'Чи є можливість отримати знижку при покупці великої кількості меблів?',
];

function QAPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const splitIndex = Math.ceil(commonQuestions.length / 2);
  const commonColumns = [
    commonQuestions.slice(0, splitIndex),
    commonQuestions.slice(splitIndex),
  ];

  const toggleGroup = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  return (
    <main className="qa-page">
      <section className="qa-page__container qa-page__breadcrumbs">
        <Breadcrumb customLabels={{ qa: 'Питання/відповіді' }} />
      </section>

      <section className="qa-page__container qa-page__top">
        <div className="qa-page__intro">
          <h1 className="qa-page__title">Питання і відповіді</h1>
          <p className="qa-page__intro-text">
            Вітаємо вас у розділі "Питання та відповіді" нашого інтернет-магазину! Ми прагнемо зробити ваш досвід покупки максимально зручним і зрозумілим. Тут ви знайдете відповіді на найпоширеніші запитання щодо замовлень, доставки, повернення товарів та нашої продукції. Ми рекомендуємо ознайомитися з цією інформацією перед оформленням замовлення, щоб уникнути можливих непорозумінь. Якщо ви не знайшли потрібну інформацію, будь ласка, зв’яжіться з нашою службою підтримки, і ми із задоволенням вам допоможемо. Наші фахівці готові відповісти на ваші запитання в будь-який час. Ваш комфорт і задоволення від покупки - наш головний пріоритет.
          </p>
        </div>

        <aside className="qa-page__contacts" aria-label="Контакти">
          <h2 className="qa-page__contacts-title">Контакти</h2>
          <div className="qa-page__contacts-card">
            <div className="qa-page__contact-row">
              <span className="qa-page__contact-icon qa-page__contact-icon--chat" aria-hidden="true" />
              <div>
                <p className="qa-page__contact-name">Зв’язатися з нами в Messenger</p>
                <p className="qa-page__contact-note">Час відповіді - 1 год.</p>
              </div>
            </div>
            <div className="qa-page__contact-row">
              <span className="qa-page__contact-icon qa-page__contact-icon--phone" aria-hidden="true" />
              <div>
                <p className="qa-page__contact-name">+380123456789</p>
                <p className="qa-page__contact-note">Час відповіді - 1 хв.</p>
              </div>
            </div>
            <div className="qa-page__contact-row">
              <span className="qa-page__contact-icon qa-page__contact-icon--email" aria-hidden="true" />
              <div>
                <p className="qa-page__contact-name">E-mail</p>
                <p className="qa-page__contact-note">Час відповіді - 24 год.</p>
              </div>
            </div>
            <div className="qa-page__schedule">
              <p className="qa-page__schedule-title">Графік роботи відділу по роботі з клієнтами</p>
              <ul>
                <li>Пн - Пт: 09:00 - 19:00</li>
                <li>Сб - Нд: 10:00 - 18:00</li>
              </ul>
            </div>
          </div>
        </aside>
      </section>

      <section className="qa-page__container qa-page__accordion" aria-label="Категорії питань">
        {qaGroups.map((group, index) => {
          const isOpen = openIndex === index;

          return (
            <article className={`qa-page__accordion-item${isOpen ? ' qa-page__accordion-item--open' : ''}`} key={group.title}>
              <button
                className="qa-page__accordion-button"
                type="button"
                aria-expanded={isOpen}
                aria-controls={`qa-panel-${index}`}
                onClick={() => toggleGroup(index)}
              >
                <span>{group.title}</span>
                <span className="qa-page__chevron" aria-hidden="true" />
              </button>
              {isOpen && (
                <div className="qa-page__accordion-panel" id={`qa-panel-${index}`}>
                  {group.questions.map((question) => (
                    <button className="qa-page__accordion-question" type="button" key={question}>
                      {question}
                    </button>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="qa-page__container qa-page__common">
        <h2 className="qa-page__common-title">Найбільш поширені питання</h2>
        <div className="qa-page__common-card">
          {commonColumns.map((column, columnIndex) => (
            <div className="qa-page__common-column" key={columnIndex}>
              {column.map((question) => (
                <button className="qa-page__common-link" type="button" key={question}>
                  {question}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default QAPage;
