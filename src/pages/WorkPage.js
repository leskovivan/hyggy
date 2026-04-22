import React from 'react';
import Header from '../components/Header';
import Prefooter from '../components/prefooter';
import Footer from '../components/Footer';
import './WorkPage.css';
import Breadcrumb from '../components/Breadcrumb';

const imgImage = "https://www.figma.com/api/mcp/asset/e20f2cb5-bb7b-4ecf-9f59-9bddb1c95832";
const imgImage1 = "https://www.figma.com/api/mcp/asset/75777ddd-84d0-4730-9b8d-5def3668eec3";
const imgImage5 = "https://www.figma.com/api/mcp/asset/db16e59d-4952-4657-9929-63f927a7644e";
const imgImage6 = "https://www.figma.com/api/mcp/asset/78cd3d08-0f69-4d89-b07b-825cdb001189";
const imgImage7 = "https://www.figma.com/api/mcp/asset/092c754e-f7f2-45d5-abc8-dc8ba01dde62";
const imgImage8 = "https://www.figma.com/api/mcp/asset/9ec25d9e-871d-40dc-8eed-8190879ac34c";

function WorkPage() {
  return (

      
        <main className="qa-page">
          
          <div className="work-page__breadcrumbs">
          <Breadcrumb />
        </div>

        <div className="work-page__hero">
          <img src={imgImage} alt="Work hero" className="work-page__hero-img" />
          <h1 className="work-page__hero-title">Працюй з нами</h1>
        </div>

        <div className="work-page__intro">
          <p className="work-page__intro-text">
            Ми – сучасний і динамічний інтернет-магазин, який активно зростає та шукає талановитих і мотивованих людей. Якщо ти готовий долучитися до команди, що рухає інновації та обслуговує клієнтів на найвищому рівні, ми будемо раді вітати тебе серед нас! Ми цінуємо професійний розвиток наших співробітників. Пропонуємо навчання, тренінги та можливість кар'єрного зростання у різних напрямках – від обслуговування клієнтів до IT і маркетингу. Ми цінуємо внесок кожного члена нашої команди, тому пропонуємо конкурентну оплату праці та систему бонусів за результативну роботу.
          </p>
          <p className="work-page__intro-text">
            Наш інтернет-магазин спеціалізується на продажі товарів для дому, меблів та декору. Ми прагнемо надавати нашим клієнтам широкий вибір високоякісної продукції за доступними цінами. Завдяки постійній орієнтації на потреби споживачів та впровадженню новітніх технологій, ми стали одним із лідерів ринку. Наші головні цінності – це довіра, інновації та сервіс, орієнтований на клієнта. Ми працюємо для того, щоб кожен покупець отримував найкращий досвід покупок, а кожен працівник – можливість для особистого та професійного розвитку.
          </p>
        </div>

        <div className="work-page__opportunities">
          <div className="work-page__opportunities-item">
            <img src={imgImage1} alt="Opportunity 1" className="work-page__opportunities-img" />
          </div>
          <div className="work-page__opportunities-item">
            <img src={imgImage5} alt="Opportunity 2" className="work-page__opportunities-img" />
          </div>
          <div className="work-page__opportunities-item">
            <img src={imgImage6} alt="Opportunity 3" className="work-page__opportunities-img" />
          </div>
        </div>

        <div className="work-page__join-banner">
          <h2 className="work-page__join-title">ЗНАЙДИ РОБОТУ, ЯКУ ТИ ШУКАЄШ</h2>
          <p className="work-page__join-text">
            Ми віримо в потенціал кожного члена нашої команди. У нас ти зможеш постійно вдосконалювати свої навички, відвідувати тренінги, брати участь у внутрішніх програмах навчання та розвивати свою кар’єру. Ми підтримуємо ініціативи та заохочуємо досягнення. Розвивайся в напрямках, які тобі цікаві – від клієнтського сервісу до логістики, від маркетингу до IT-рішень. Ми розуміємо, наскільки важливо підтримувати баланс між роботою та особистим життям. Тому пропонуємо гнучкий графік роботи, що дозволяє поєднувати роботу з іншими важливими справами. Окрім того, ти зможеш працювати віддалено з будь-якої точки світу, використовуючи сучасні технології для ефективної комунікації з командою.
          </p>
        </div>

        <div className="work-page__section">
          <div className="work-page__section-content">
            <h3 className="work-page__section-title">РОБОТА В РІТЕЙЛІ</h3>
            <p className="work-page__section-text">
              Ми цінуємо талант і наполегливість наших співробітників, тому пропонуємо гідну оплату праці та систему бонусів, яка мотивує досягати нових висот. Твоя праця буде винагороджена відповідно до твоїх зусиль і результатів. Наш інтернет-магазин постійно впроваджує новітні технології, щоб залишатися на піку ринку електронної комерції. В нашій компанії ти знайдеш колектив однодумців, які підтримують одне одного та прагнуть досягати спільних цілей.
            </p>
          </div>
          <img src={imgImage7} alt="Retail" className="work-page__section-img" />
        </div>

        <div className="work-page__section work-page__section--reverse">
          <div className="work-page__section-content">
            <h3 className="work-page__section-title">РОБОТА В ГОЛОВНОМУ ОФІСІ</h3>
            <p className="work-page__section-text">
              Ми віримо, що успіх – це результат командної роботи, де кожен співробітник відіграє важливу роль. У нас ти знайдеш не тільки колег, але й друзів, які завжди готові допомогти та підтримати. У нас кожен співробітник може впливати на майбутнє компанії. Твої ідеї, ініціативи та пропозиції не залишаться непоміченими. Ми заохочуємо творчий підхід до роботи та надаємо можливість втілювати нові ідеї в життя. Ти зможеш робити реальний внесок у розвиток бізнесу, бачивши результати своєї праці. Ми віримо в чесність, відповідальність та взаємодопомогу.
            </p>
          </div>
          <img src={imgImage8} alt="Office" className="work-page__section-img" />
        </div>

        <div className="work-page__section">
          <div className="work-page__section-content">
             <h3 className="work-page__section-title">РОБОТА В ВІДДІЛІ ПО РОБОТІ З КЛІЄНТАМИ</h3>
            <p className="work-page__section-text">
              Ми постійно вдосконалюємо сервіс та якість обслуговування... ти зможеш працювати віддалено з будь-якої точки світу, використовуючи сучасні технології для ефективної комунікації з командою. Ми цінуємо талант і наполегливість наших співробітників, тому пропонуємо гідну оплату праці та систему бонусів, яка мотивує досягати нових висот. Твоя праця буде винагороджена відповідно до твоїх зусиль і результатів.
            </p>
          </div>
          <img src={imgImage7} alt="Customer Service" className="work-page__section-img" />
        </div>

        <div className="work-page__join-banner">
          <h2 className="work-page__join-title">ПРИЄДНУЙСЯ ДО НАШОЇ КОМАНДИ І ПРАЦЮЙ З НАМИ</h2>
          <p className="work-page__join-text">
            Ми віримо в потенціал кожного члена нашої команди. У нас ти зможеш постійно вдосконалювати свої навички, відвідувати тренінги, брати участь у внутрішніх програмах навчання та розвивати свою кар’єру. Ми підтримуємо ініціативи та заохочуємо досягнення. Розвивайся в напрямках, які тобі цікаві – від клієнтського сервісу до логістики, від маркетингу до IT-рішень. Ми розуміємо, наскільки важливо підтримувати баланс між роботою та особистим життям. Тому пропонуємо гнучкий графік роботи, що дозволяє поєднувати роботу з іншими важливими справами.
          </p>
          </div>
        </main>

  );
}

export default WorkPage;
