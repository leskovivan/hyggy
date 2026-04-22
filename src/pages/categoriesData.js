import bedroom from '../images/bedroom.png';
import bathroom from '../images/bathroom.png';
import office from '../images/office.png';
import livingRoom from '../images/vitalynia.png';
import kitchen from '../images/kitchen.png';
import garden from '../images/Garden.png';

export const categories = [
  { id: 1, title: 'Спальня', img: bedroom, slug: 'bedroom' },
  { id: 2, title: 'Ванна', img: bathroom, slug: 'bathroom' },
  { id: 3, title: 'Офіс', img: office, slug: 'office' },
  { id: 4, title: 'Вітальня', img: livingRoom, slug: 'living-room' },
  { id: 5, title: 'Кухня', img: kitchen, slug: 'kitchen' },
  { id: 6, title: 'Для саду', img: garden, slug: 'garden' },
  // Добавляй сюда новые объекты, и они сами появятся на экране
];

export default categories;