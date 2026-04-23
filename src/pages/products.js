import mumuto from '../images/muuto.png';
import office from '../images/office.png';
import garden from '../images/Garden.png';

export const products = [
  // Твої попередні товари (Стілець та Диван BISTRUP)
  {
    id: 1,
    category: 'kitchen',
    slug: 'bistrup-chair',
    brand: 'BISTRUP',
    name: 'Стілець обідній BISTRUP оливковий/дуб',
    price: 60,
    oldPrice: 100,
    inStock: true,
    hasDelivery: true,
    shortDescription: 'Стілець BISTRUP — це стильне поєднання сучасного дизайну та практичності. Ідеально підходить для обідньої зони, забезпечуючи комфорт і підтримку.',
    promoEndDate: '2026-04-30T23:59:59',
    isAlwaysLowPrice: false,
    discountPercent: 40,
    isNew: true,
    isGreatDeal: true,
    article: '3605035',
    image: mumuto,
    images: [mumuto, office, garden],
    description: 'Стілець BISTRUP — це стильне поєднання сучасного дизайну...',
    characteristics: [
      { label: 'Матеріал', value: 'ППУ, Фанера, Поліестер, Сталь' },
      { label: 'Колір', value: 'Оливковий, Дуб' },
      { label: 'Вага', value: '4 кг' },
    ],
    reviews: [
      { id: 1, author: 'Олена', rating: 3, text: 'Цей стілець став справжньою знахідкою...' },
      { id: 2, author: 'Андрій', rating: 5, text: 'Придбали кілька стільців...' }
    ]
  },
  {
    id: 2,
    category: 'kitchen',
    slug: 'bistrup-sofa',
    brand: 'BISTRUP',
    name: 'Диван обідній BISTRUP оливковий/дуб',
    price: 70,
    oldPrice: 100,
    inStock: true,
    hasDelivery: false,
    promoEndDate: '2026-04-30T23:59:59',
    article: '908312',
    image: mumuto,
    images: [mumuto, office, garden],
    description: 'Диван BISTRUP — це стильне поєднання сучасного дизайну...',
    characteristics: [
      { label: 'Матеріал', value: 'ППУ, Фанера, Поліестер, Сталь' },
      { label: 'Колір', value: 'Оливковий, Дуб' },
      { label: 'Вага', value: '10 кг' },
    ],
    reviews: [
      { id: 1, author: 'Олена', rating: 2, text: 'Цей диван став справжньою знахідкою...' },
      { id: 2, author: 'Андрій', rating: 4, text: 'Придбали кілька диванів...' }
    ]
  },

  // --- НОВІ ТОВАРИ ДЛЯ КУХНІ ---

  {
    id: 3,
    category: 'kitchen',
    slug: 'vedbo-dining-table',
    brand: 'VEDBO',
    name: 'Стіл обідній VEDBO білий/дуб',
    price: 250,
    oldPrice: 320,
    inStock: true,
    hasDelivery: true,
    promoEndDate: '2026-05-15T23:59:59',
    article: '1048239',
    image: office, // Використовуємо твої існуючі імпорти для прикладу
    images: [office, mumuto, garden],
    description: 'Обідній стіл VEDBO з матовою поверхнею, яка стійка до відбитків пальців. Ідеально підходить для великої родини, поєднуючи мінімалізм та практичність. Ніжки з масиву дуба гарантують стійкість.',
    characteristics: [
      { label: 'Матеріал', value: 'МДФ, Масив дуба, Акриловий лак' },
      { label: 'Колір', value: 'Білий, Натуральний дуб' },
      { label: 'Розмір', value: '160x85 см' },
      { label: 'Вага', value: '35 кг' },
      { label: 'Кількість місць', value: 'На 6 персон' }
    ],
    reviews: [
      { id: 1, author: 'Марія', rating: 5, text: 'Дуже стильний і міцний стіл. Легко збирається, поверхня дійсно не залишає відбитків.' },
      { id: 2, author: 'Віталій', rating: 4, text: 'Стіл супер, але коробка була трохи пошкоджена при доставці. Сам товар цілий.' }
    ]
  },
  {
    id: 4,
    category: 'kitchen',
    slug: 'nordviken-bar-stool',
    brand: 'NORDVIKEN',
    name: 'Барний стілець NORDVIKEN чорний',
    price: 85,
    oldPrice: null, // Товар без знижки (без перекресленої ціни і таймера)
    inStock: false, // Немає в наявності (щоб перевірити червоний статус)
    hasDelivery: false,
    promoEndDate: null,
    article: '7729104',
    image: garden,
    images: [garden, office, mumuto],
    description: 'Зручний барний стілець з поглибленням у сидінні. Ідеальна висота для кухонного острова або високої барної стійки. Класичний чорний колір пасуватиме до будь-якого сучасного інтер\'єру.',
    characteristics: [
      { label: 'Матеріал', value: 'Масив сосни, Морилка, Прозорий акриловий лак' },
      { label: 'Колір', value: 'Чорний' },
      { label: 'Висота сидіння', value: '74 см' },
      { label: 'Протестовано для ваги', value: '110 кг' },
      { label: 'Вага', value: '6 кг' }
    ],
    reviews: [
      { id: 1, author: 'Анна', rating: 5, text: 'Чудово підійшли до нашої чорної кухні! Зручні підніжки.' }
    ]
  },
  {
    id: 5,
    category: 'kitchen',
    slug: 'forhoja-kitchen-cart',
    brand: 'FÖRHÖJA',
    name: 'Кухонний візок FÖRHÖJA масив берези',
    price: 130,
    oldPrice: 160,
    inStock: true,
    hasDelivery: true,
    promoEndDate: '2026-06-01T23:59:59',
    article: '8910234',
    image: mumuto,
    images: [mumuto, garden, office],
    description: 'Додатковий робочий простір і місце для зберігання на вашій кухні. Візок можна легко пересувати завдяки коліщаткам. Має зручні висувні шухляди, які відкриваються з обох боків.',
    characteristics: [
      { label: 'Матеріал', value: 'Масив берези, Прозорий акриловий лак' },
      { label: 'Колір', value: 'Світле дерево (Береза)' },
      { label: 'Розмір в зібраному стані', value: '100x43 см, висота 90 см' },
      { label: 'Вага', value: '18 кг' },
      { label: 'Особливості', value: '2 шухляди, коліщатка з одного боку' }
    ],
    reviews: [
      { id: 1, author: 'Оксана', rating: 5, text: 'Супер візок! Використовую як додаткову стільницю для нарізки і зберігання овочів.' },
      { id: 2, author: 'Сергій', rating: 5, text: 'Натуральне дерево виглядає дуже дорого. Зібрав за 40 хвилин.' },
      { id: 3, author: 'Катерина', rating: 4, text: 'Все добре, але коліщата іноді заїдають на плитці.' }
    ]
  },
  {
    id: 6,
    category: 'living-room',
    slug: 'havberg-armchair',
    brand: 'HAVBERG',
    name: 'Крісло для відпочинку HAVBERG темно-сіре',
    price: 180,
    oldPrice: 220,
    inStock: true,
    hasDelivery: true,
    promoEndDate: '2026-05-10T23:59:59',
    article: '4050212',
    image: office,
    images: [office, mumuto, garden],
    description: 'Зручне крісло HAVBERG з високою спинкою забезпечує оптимальну підтримку шиї та спини. М\'яка оббивка з міцної тканини гарантує комфортний відпочинок після довгого робочого дня.',
    characteristics: [
      { label: 'Матеріал', value: '100% поліестер, Пінополіуретан, Сталь' },
      { label: 'Колір', value: 'Темно-сірий' },
      { label: 'Ширина', value: '78 см' },
      { label: 'Глибина', value: '85 см' },
      { label: 'Висота', value: '100 см' }
    ],
    reviews: [
      { id: 1, author: 'Олег', rating: 5, text: 'Дуже зручне крісло! Читати в ньому — одне задоволення.' },
      { id: 2, author: 'Ірина', rating: 4, text: 'Тканина приємна на дотик, але збирає трохи шерсті від кота.' }
    ]
  },
  {
    id: 7,
    category: 'bedroom',
    slug: 'tarva-bed-frame',
    brand: 'TARVA',
    name: 'Ліжко двоспальне TARVA 160x200 сосна',
    price: 210,
    oldPrice: null,
    inStock: true,
    hasDelivery: true,
    promoEndDate: null,
    article: '8992923',
    image: garden,
    images: [garden, office, mumuto],
    description: 'Каркас ліжка з масиву сосни. Натуральний матеріал, який з часом виглядає лише краще. Ви можете покрити його олією, воском, лаком або фарбою, щоб зробити ліжко унікальним.',
    characteristics: [
      { label: 'Матеріал', value: 'Масив сосни (без покриття)' },
      { label: 'Розмір спального місця', value: '160x200 см' },
      { label: 'Довжина', value: '209 см' },
      { label: 'Ширина', value: '168 см' },
      { label: 'Висота узголів\'я', value: '92 см' }
    ],
    reviews: [
      { id: 1, author: 'Наталія', rating: 5, text: 'Прекрасне дерево, пахне сосною. Ми самі пофарбували його у білий колір.' },
      { id: 2, author: 'Михайло', rating: 5, text: 'Проста збірка, надійна конструкція. Нічого не скрипить.' }
    ]
  },
  {
    id: 8,
    category: 'kitchen',
    slug: 'besta-tv-bench',
    brand: 'BESTÅ',
    name: 'Тумба під телевізор BESTÅ чорно-коричнева',
    price: 150,
    oldPrice: 190,
    inStock: true,
    hasDelivery: false,
    promoEndDate: '2026-06-20T23:59:59',
    article: '2934041',
    image: mumuto,
    images: [mumuto, office, garden],
    description: 'Сучасна тумба під телевізор з прихованим зберіганням. Завдяки спеціальним отворам на задній панелі, ви зможете легко сховати та організувати всі дроти від техніки.',
    characteristics: [
      { label: 'Матеріал', value: 'ДСП, Паперова плівка, Пластик' },
      { label: 'Колір', value: 'Чорно-коричневий' },
      { label: 'Макс. навантаження на верхню панель', value: '50 кг' },
      { label: 'Ширина', value: '180 см' },
      { label: 'Глибина', value: '42 см' }
    ],
    reviews: [
      { id: 1, author: 'Володимир', rating: 4, text: 'Гарна тумба, але на чорній поверхні дуже видно пил.' }
    ]
  },
  {
    id: 9,
    category: 'kitchen',
    slug: 'lersta-floor-lamp',
    brand: 'LERSTA',
    name: 'Торшер для читання LERSTA алюміній',
    price: 25,
    oldPrice: 35,
    inStock: false, // Немає в наявності
    hasDelivery: false,
    promoEndDate: '2026-04-28T23:59:59',
    article: '0011064',
    image: office,
    images: [office, garden, mumuto],
    description: 'Класичний торшер з гнучким штативом. Ви можете легко спрямувати світло саме туди, куди вам потрібно, що робить його ідеальним вибором для читання або роботи.',
    characteristics: [
      { label: 'Матеріал', value: 'Алюміній, Сталь, Пластик' },
      { label: 'Макс. потужність лампи', value: '20 Вт' },
      { label: 'Висота', value: '131 см' },
      { label: 'Діаметр основи', value: '25.5 см' },
      { label: 'Довжина кабелю', value: '2.0 м' }
    ],
    reviews: [
      { id: 1, author: 'Тетяна', rating: 5, text: 'Стильний мінімалізм. Світить яскраво, гнеться в усі боки. За свої гроші — топ!' }
    ]
  },
  {
    id: 10,
    category: 'kitchen',
    slug: 'lagkapten-desk',
    brand: 'LAGKAPTEN',
    name: 'Письмовий стіл LAGKAPTEN білий/антрацит',
    price: 95,
    oldPrice: null,
    inStock: true,
    hasDelivery: true,
    promoEndDate: null,
    article: '7941743',
    image: garden,
    images: [garden, mumuto, office],
    description: 'Просторий письмовий стіл, за яким вистачить місця і для ноутбука, і для документів. Легкий, але міцний завдяки спеціальній конструкції стільниці.',
    characteristics: [
      { label: 'Матеріал стільниці', value: 'ДВП, Акрилова фарба' },
      { label: 'Матеріал ніжок', value: 'Сталь, Епоксидне порошкове покриття' },
      { label: 'Довжина', value: '140 см' },
      { label: 'Ширина', value: '60 см' },
      { label: 'Висота', value: '73 см' }
    ],
    reviews: [
      { id: 1, author: 'Денис', rating: 5, text: 'Зібрав за 10 хвилин (просто прикрутити 4 ніжки). Стіл великий і зручний для роботи з дому.' },
      { id: 2, author: 'Аліна', rating: 4, text: 'Трішки хитається, якщо сильно спертися, але для ноутбука цілком вистачає.' }
    ]
  }
];