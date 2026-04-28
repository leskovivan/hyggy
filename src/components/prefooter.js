import React from 'react';
import './prefooter.css';
import sofaIcon from '../images/sofa.svg';
import flagIcon from '../images/flag.svg';
import catalogIcon from '../images/catalog.svg';

const infoItems = [
  {
    icon: sofaIcon,
    iconAlt: 'Комфорт',
    text: 'Різноманітний вибір сучасних рішень для декорування та облаштування як інтер’єру, так і екстер’єру.',
  },
  {
    icon: flagIcon,
    iconAlt: 'Стиль',
    text: 'Наш стиль нагадує скандинавський, але ми виходимо за рамки одного напрямку, пропонуючи універсальні та функціональні варіанти, що задовольнять різні смаки.',
  },
  {
    icon: catalogIcon,
    iconAlt: 'Каталог',
    text: 'Ми орієнтовані на різні категорії покупців, пропонуючи товари в діапазоні від середньо-низьких до середньо-високих цін.',
  },
];

function Prefooter() {
  return (
    <section className="prefooter" data-node-id="1801:172" id="newsletter">
      <div className="prefooter__top">
        <div className="content-prefooter">
          {infoItems.map((item) => (
            <article className="prefooter__info-item" key={item.iconAlt}>
              <div className="prefooter__icon-wrap">
                <img className="prefooter__icon-svg" src={item.icon} alt={item.iconAlt} />
              </div>
              <p className="prefooter__info-text">{item.text}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="prefooter__bottom">
        <h2 className="prefooter__title">
          Підпишись на розсилку новин та отримай код на безкоштовну доставку для свого першого замовлення!
        </h2>

        <p className="prefooter__description">
          Підпишіться на нашу розсилку та отримайте бонус! 10% знижка на перше замовлення, ексклюзивні пропозиції та ранній доступ до розпродажів. Введіть свій email нижче та почніть отримувати переваги!
        </p>

        <form className="prefooter__form" onSubmit={(event) => event.preventDefault()}>
          <input className="prefooter__input" type="text" placeholder="Ім’я" aria-label="Ім’я" />
          <input className="prefooter__input prefooter__input--email" type="email" placeholder="E-mail" aria-label="E-mail" />
          <button className="prefooter__button" type="submit">Поділитися</button>
        </form>
      </div>
    </section>
  );
}

export default Prefooter;
