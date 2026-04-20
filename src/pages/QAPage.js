import React, { useState } from 'react';
import './QAPage.css';
import { Link } from 'react-router-dom';

const QA_CATEGORIES = [
  "Питання пов'язані з онлайн замовленнями",
  "Перевезення та доставка",
  "Повернення та претензії",
  "Питання стосовно продукції",
  "Питання пов’язані з магазинами та замовленнями із магазинів"
];

const COMMON_QUESTIONS_LEFT = [
  "Як я можу зробити замовлення в вашому інтернет-магазині?",
  "Чи можу я змінити або скасувати своє замовлення після його оформлення?",
  "Які варіанти доставки доступні для замовлень?",
  "Скільки часу займе доставка моєї покупки?",
  "Як я можу відстежувати статус свого замовлення?",
  "Які умови повернення товарів, якщо вони не підійшли?",
  "Що робити, якщо товар прибув пошкодженим?"
];

const COMMON_QUESTIONS_RIGHT = [
  "Які матеріали використовуються для виготовлення вашої продукції?",
  "Як я можу знайти найближчий до мене магазин, що продає ваші меблі?",
  "Чи можу я замовити товар в магазині, а забрати його самостійно?",
  "Чи надаєте ви послуги складання меблів?",
  "Які методи оплати ви приймаєте?",
  "Чи є можливість отримати знижку при покупці великої кількості меблів?"
];

function QAPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="qa-page">
      <div className="qa-page__breadcrumbs">
        <Link to="/" className="qa-page__breadcrumb-link">Домашня сторінка</Link>
        <div className="qa-page__breadcrumb-icon">
            <svg width="11" height="16" viewBox="0 0 11 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 0L0 2.36L5.5 8L0 13.64L2.5 16L10.5 8L2.5 0Z" fill="#000" fillOpacity="0.75" />
            </svg>
        </div>
        <span className="qa-page__breadcrumb-current">Питання/відповіді</span>
      </div>

      <div className="qa-page__header">
        <h1 className="qa-page__title">Питання і відповіді</h1>
      </div>

      <div className="qa-page__content-top">
        <div className="qa-page__intro">
          <p>
            Вітаємо вас у розділі "Питання та відповіді" нашого інтернет-магазину! Ми прагнемо зробити ваш досвід покупки максимально зручним і зрозумілим. Тут ви знайдете відповіді на найпоширеніші запитання щодо замовлень, доставки, повернення товарів та нашої продукції. Ми рекомендуємо ознайомитися з цією інформацією перед оформленням замовлення, щоб уникнути можливих непорозумінь. Якщо ви не знайшли потрібну інформацію, будь ласка, зв’яжіться з нашою службою підтримки, і ми із задоволенням вам допоможемо. Наші фахівці готові відповісти на ваші запитання в будь-який час. Ваш комфорт і задоволення від покупки – наш головний пріоритет. Ми постійно вдосконалюємо наш сервіс, щоб зробити його ще більш зручним для вас. Дякуємо, що обрали нас для облаштування вашого дому!
          </p>
        </div>

        <div className="qa-page__contacts-card">
          <h2 className="qa-page__contacts-title">Контакти</h2>
          
          <div className="qa-page__contacts-list">
            <div className="qa-page__contact-item">
              <img src="https://www.figma.com/api/mcp/asset/4941208a-db07-47aa-9da8-c37e626c0459" alt="Messenger" className="qa-page__contact-icon" />
              <div className="qa-page__contact-info">
                <span className="qa-page__contact-name">Зв’язатися з нами в Messenger</span>
                <span className="qa-page__contact-time">Час відповіді - 1 год.</span>
              </div>
            </div>
            
            <div className="qa-page__contacts-divider"></div>

            <div className="qa-page__contact-item">
              <img src="https://www.figma.com/api/mcp/asset/70dbd602-a2c0-428b-9370-87d2d3154a8d" alt="Phone" className="qa-page__contact-icon qa-page__contact-icon--rotate" />
              <div className="qa-page__contact-info">
                <span className="qa-page__contact-name">+380123456789</span>
                <span className="qa-page__contact-time">Час відповіді - 1 хв.</span>
              </div>
            </div>

            <div className="qa-page__contacts-divider"></div>

            <div className="qa-page__contact-item">
              <img src="https://www.figma.com/api/mcp/asset/f9fe0cd8-3008-46cc-be83-6f882b1ba779" alt="Email" className="qa-page__contact-icon qa-page__contact-icon--email" />
              <div className="qa-page__contact-info">
                <span className="qa-page__contact-name">E-mail</span>
                <span className="qa-page__contact-time">Час відповіді - 24 год.</span>
              </div>
            </div>

            <div className="qa-page__contact-schedule">
              <div className="qa-page__schedule-item">
                 <img src="https://www.figma.com/api/mcp/asset/0652784b-9fb5-48f4-b701-a4a8b62bfbe3" alt="Clock" className="qa-page__contact-icon qa-page__contact-icon--clock" />
                 <div className="qa-page__contact-info">
                    <span className="qa-page__schedule-title" style={{fontWeight: 700}}>Графік роботи відділу по роботі з клієнтами</span>
                    <ul className="qa-page__schedule-list">
                      <li>Пн – Пт: 09:00 - 19:00</li>
                      <li>Сб – Нд: 10:00 - 18:00</li>
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="qa-page__accordion-section">
        {QA_CATEGORIES.map((category, index) => (
          <div key={index} className={`qa-page__accordion-item ${openIndex === index ? 'active' : ''}`} onClick={() => toggleAccordion(index)}>
            <h3 className="qa-page__accordion-title">{category}</h3>
            <img 
               src="https://www.figma.com/api/mcp/asset/cbcb1e8e-ce3d-49e9-b04e-8cf48db9b9d6" 
               alt="Toggle" 
               className={`qa-page__accordion-icon ${openIndex === index ? 'rotated' : ''}`} 
            />
          </div>
        ))}
      </div>

      <div className="qa-page__common-section">
        <h2 className="qa-page__common-title">Найбільш поширені питання</h2>
        <div className="qa-page__common-lists">
          <ul className="qa-page__common-list">
            {COMMON_QUESTIONS_LEFT.map((q, i) => (
              <li key={i}><a href="#" className="qa-page__common-link">{q}</a></li>
            ))}
          </ul>
          <ul className="qa-page__common-list">
            {COMMON_QUESTIONS_RIGHT.map((q, i) => (
              <li key={i}><a href="#" className="qa-page__common-link">{q}</a></li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

export default QAPage;
