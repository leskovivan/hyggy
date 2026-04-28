import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const footerColumns = [
  {
    title: 'Категорії товарів',
    links: [
      ['Спальня', '/category/bedroom'],
      ['Ванна', '/category/bathroom'],
      ['Офіс', '/category/office'],
      ['Вітальня', '/category/living-room'],
      ['Кухня та їдальня', '/category/kitchen'],
      ['Зберігання', '/category/storage'],
      ['Для вікон', '/category/windows'],
      ['Для саду', '/category/garden'],
      ['Для дому', '/category/home'],
      ['Усі категорії', '/category'],
    ],
  },
  {
    title: 'Інформація',
    links: [
      ['Зворотній зв’язок', '/qa'],
      ['Магазини і графіки роботи', '/shops'],
      ['Умови та положення', '/qa'],
      ['Доставка', '/qa'],
      ['Політика конфіденційності', '/qa'],
    ],
  },
  {
    title: 'Hyggy',
    links: [
      ['Про нас', '/about'],
      ['Робота в Hyggy', '/work'],
      ['Підписатись на розсилку', '#newsletter'],
      ['Блог', '/blog'],
      ['B2B', '/qa'],
      ['Корисні посилання', '/qa'],
    ],
  },
];

const paymentLogos = [
  { src: '/images/visa.png', alt: 'Visa' },
  { src: '/images/mastercard.png', alt: 'Mastercard' },
  { src: '/images/googlepay.png', alt: 'Google Pay' },
];

const socialLinks = [
  { src: '/images/telegram.svg', alt: 'Telegram' },
  { src: '/images/instagram.svg', alt: 'Instagram' },
  { src: '/images/facebook.png', alt: 'Facebook' },
  { src: '/images/youtube.svg', alt: 'YouTube' },
];

function Footer() {
  return (
    <footer className="footer" data-node-id="1796:123">
      <div className="footer__content">
        {footerColumns.map((column) => (
          <section className="footer__column" key={column.title}>
            <h3 className="footer__title">{column.title}</h3>
            {column.links.map(([label, to]) => (
              to.startsWith('#') ? (
                <a href={to} className="footer__link" key={label}>{label}</a>
              ) : (
                <Link to={to} className="footer__link" key={label}>{label}</Link>
              )
            ))}
          </section>
        ))}

        <section className="footer__column footer__column--contact">
          <h3 className="footer__title">Центральний офіс</h3>
          <p className="footer__text">м. Київ<br />вул. Іоанна Павла, 21<br />123456</p>

          <p className="footer__subtitle">HYGGY B2B</p>
          <p className="footer__text">Тел: <a className="footer__link footer__link--underlined" href="tel:+380123456789">+380123456789</a></p>
          <p className="footer__text">Імейл: <a className="footer__link footer__link--underlined" href="mailto:b2b@hyggy.com">b2b@hyggy.com</a></p>
          <Link className="footer__link footer__link--strong footer__link--underlined" to="/qa">Зв’яжіться з нами</Link>

          <p className="footer__subtitle footer__subtitle--spaced">Зворотній зв’язок:</p>
          <a className="footer__link footer__link--underlined" href="mailto:email@hyggy.com">email@hyggy.com</a>
          <p className="footer__text">Тел: <a className="footer__link footer__link--underlined" href="tel:+380123456789">+380123456789</a></p>
          <Link className="footer__link footer__link--strong footer__link--underlined" to="/qa">Зв’яжіться з нами</Link>
        </section>
      </div>

      <div className="footer__bottom">
        <div className="footer__payments" aria-label="Способи оплати">
          {paymentLogos.map((logo) => (
            <img src={logo.src} alt={logo.alt} className="footer__payment-logo" key={logo.alt} />
          ))}
        </div>

        <div className="footer__networks" aria-label="Соціальні мережі">
          {socialLinks.map((network) => (
            <a className="footer__network-link" href="/" aria-label={network.alt} key={network.alt}>
              <img src={network.src} alt="" className="footer__network-icon" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
