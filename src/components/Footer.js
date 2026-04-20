import React from 'react';
import './Footer.css';
import visaLogo from '../images/visa.png';
import mastercardLogo from '../images/mastercard.png';
import googlePayLogo from '../images/googlepay.png';
import telegramLogo from '../images/telegram.svg';
import instagramLogo from '../images/instagram.svg';
import facebookLogo from '../images/facebook.png';
import youtubeLogo from '../images/youtube.svg';

const PAYMENT_LOGOS = [
	{ src: visaLogo, alt: 'Visa' },
	{ src: mastercardLogo, alt: 'Mastercard' },
	{ src: googlePayLogo, alt: 'Google Pay' },
];

const SOCIAL_NETWORKS_IMAGE = [
	{ src: telegramLogo, alt: 'Telegram' },
	{ src: instagramLogo, alt: 'Instagram' },
	{ src: facebookLogo, alt: 'Facebook' },
	{ src: youtubeLogo, alt: 'YouTube' },
];

function Footer() {
	return (
		<footer className="footer" data-node-id="1796:123">
			<div className="footer__content">
				<section className="footer__column">
					<h3 className="footer__title">Категорії товарів</h3>
					<a href="/" className="footer__link">Спальня</a>
					<a href="/" className="footer__link">Ванна</a>
					<a href="/" className="footer__link">Офіс</a>
					<a href="/" className="footer__link">Вітальня</a>
					<a href="/" className="footer__link">Кухня та їдальня</a>
					<a href="/" className="footer__link">Зберігання</a>
					<a href="/" className="footer__link">Для вікон</a>
					<a href="/" className="footer__link">Для саду</a>
					<a href="/" className="footer__link">Для дому</a>
					<a href="/" className="footer__link">Усі категорії</a>
				</section>

				<section className="footer__column">
					<h3 className="footer__title">Інформація</h3>
					<a href="/" className="footer__link">Зворотній зв’язок</a>
					<a href="/" className="footer__link">Магазини і графіки роботи</a>
					<a href="/" className="footer__link">Умови та положення</a>
					<a href="/" className="footer__link">Доставка</a>
					<a href="/" className="footer__link">Політика конфіденційності</a>
				</section>

				<section className="footer__column">
					<h3 className="footer__title">Hyggy</h3>
					<a href="/" className="footer__link">Про нас</a>
					<a href="/" className="footer__link">Робота в Hyggy</a>
					<a href="/" className="footer__link">Підписатись на розсилку</a>
					<a href="/" className="footer__link">Блог</a>
					<a href="/" className="footer__link">B2B</a>
					<a href="/" className="footer__link">Корисні посилання</a>
				</section>

				<section className="footer__column footer__column--contact">
					<h3 className="footer__title">Центральний офіс</h3>
					<p className="footer__text">
						м. Київ
						<br />
						вул. Іоанна Павла, 21
						<br />
						123456
					</p>

					<p className="footer__subtitle">HYGGY B2B</p>
					<p className="footer__text">Тел: <a className="footer__link footer__link--underlined" href="tel:+380123456789">+380123456789</a></p>
					<p className="footer__text">Імейл: <a className="footer__link footer__link--underlined" href="mailto:b2b@hyggy.com">b2b@hyggy.com</a></p>
					<a className="footer__link footer__link--strong footer__link--underlined" href="/">Зв’яжіться з нами</a>

					<p className="footer__subtitle footer__subtitle--spaced">Зворотній зв’язок:</p>
					<a className="footer__link footer__link--underlined" href="mailto:email@hyggy.com">email@hyggy.com</a>
					<p className="footer__text">Тел: <a className="footer__link footer__link--underlined" href="tel:+380123456789">+380123456789</a></p>
					<a className="footer__link footer__link--strong footer__link--underlined" href="/">Зв’яжіться з нами</a>
				</section>
			</div>

			<div className="footer__bottom">
				<div className="footer__payments" aria-label="Способи оплати">
					{PAYMENT_LOGOS.map((logo) => (
						<img
							key={logo.alt}
							src={logo.src}
							alt={logo.alt}
							className="footer__payment-logo"
						/>
					))}
				</div>

				<div className="footer__networks" aria-label="Соціальні мережі">
					{SOCIAL_NETWORKS_IMAGE.map((network) => (
						<img
							key={network.alt}
							src={network.src}
							alt={network.alt}
							className="footer__network-icon"
						/>
					))}
				</div>
			</div>
		</footer>
	);
}

export default Footer;
