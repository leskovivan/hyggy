import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './ShopsPage.css';

const FALLBACK_STORES = [
  {
    id: '1',
    name: 'HYGGY Івано-Франківськ, ТЦ Арсен',
    city: 'Івано-Франківськ',
    address: 'Північний бульвар 2а',
    phone: '+380442470786',
    marker: { left: '36%', top: '33%' },
  },
  {
    id: '2',
    name: 'HYGGY Київ ТЦ Променада',
    city: 'Київ',
    address: 'вул. Овруцька, 18',
    phone: '+380442470786',
    marker: { left: '69%', top: '25%' },
  },
  {
    id: 'zhytomyr-oldi',
    name: 'HYGGY Житомир ТЦ Олді',
    city: 'Житомир',
    address: 'вул. Михайла Грушевського, 5 10002 Житомир',
    phone: '+380442470786',
    marker: { left: '35%', top: '39%' },
  },
  {
    id: 'vinnytsia',
    name: 'HYGGY Вінниця',
    city: 'Вінниця',
    address: 'вул. Соборна, 12',
    phone: '+380442470786',
    marker: { left: '33%', top: '76%' },
  },
  {
    id: 'cherkasy',
    name: 'HYGGY Черкаси',
    city: 'Черкаси',
    address: 'бул. Шевченка, 208',
    phone: '+380442470786',
    marker: { left: '69%', top: '56%' },
  },
];

const DAYS = [
  ['mon', 'Понеділок'],
  ['tue', 'Вівторок'],
  ['wed', 'Середа'],
  ['thu', 'Четвер'],
  ['fri', 'П’ятниця'],
  ['sat', 'Субота'],
  ['sun', 'Неділя'],
];

const DEFAULT_SCHEDULE = {
  mon: { start: '10:00', end: '20:00' },
  tue: { start: '10:00', end: '20:00' },
  wed: { start: '10:00', end: '20:00' },
  thu: { start: '10:00', end: '20:00' },
  fri: { start: '10:00', end: '20:00' },
  sat: { start: '10:00', end: '20:00' },
  sun: { start: '10:00', end: '20:00' },
};

const getStoreText = (store) => {
  const fallback = FALLBACK_STORES.find(item => String(item.id) === String(store.id));
  return {
    ...fallback,
    ...store,
    name: fallback?.name || store.name || 'HYGGY Магазин',
    city: fallback?.city || store.city || '',
    address: fallback?.address || store.address || '',
    phone: store.phone || fallback?.phone || '+380442470786',
    marker: fallback?.marker || null,
    schedule: { ...DEFAULT_SCHEDULE, ...(store.schedule || {}) },
    image: store.image || '/images/shops/shop-interior.png',
  };
};

const scheduleRange = day => `${day?.start || '10:00'} - ${day?.end || '20:00'}`;

const isOpenNow = store => {
  const todayKey = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1][0];
  const today = store.schedule?.[todayKey] || DEFAULT_SCHEDULE[todayKey];
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMinute] = today.start.split(':').map(Number);
  const [endHour, endMinute] = today.end.split(':').map(Number);
  return minutes >= startHour * 60 + startMinute && minutes <= endHour * 60 + endMinute;
};

function ShopsPage() {
  const [stores, setStores] = useState([]);
  const [query, setQuery] = useState('');
  const [openOnly, setOpenOnly] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/stores')
      .then(res => (res.ok ? res.json() : []))
      .then(data => setStores(Array.isArray(data) ? data : []))
      .catch(() => setStores([]));
  }, []);

  const preparedStores = useMemo(() => {
    const merged = [...stores];
    FALLBACK_STORES.forEach(fallback => {
      if (!merged.some(store => String(store.id) === String(fallback.id))) {
        merged.push(fallback);
      }
    });
    return merged.map(getStoreText).filter(store => store.marker);
  }, [stores]);

  const visibleStores = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return preparedStores.filter(store => {
      const matchesQuery = !normalizedQuery || [store.name, store.city, store.address]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
      const matchesOpen = !openOnly || isOpenNow(store);
      return matchesQuery && matchesOpen;
    });
  }, [preparedStores, query, openOnly]);

  const selectedStore = useMemo(() => {
    if (!selectedStoreId) return null;
    return preparedStores.find(store => String(store.id) === String(selectedStoreId)) || null;
  }, [preparedStores, selectedStoreId]);

  const openStore = store => {
    setSelectedStoreId(store.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="shops-page">
      <div className="shops-page__container">
        <nav className="shops-breadcrumb" aria-label="Навігація">
          <Link to="/">Домашня сторінка</Link>
          <span aria-hidden="true">&gt;</span>
          <button type="button" onClick={() => setSelectedStoreId(null)}>Пошук магазинів</button>
          {selectedStore && (
            <>
              <span aria-hidden="true">&gt;</span>
              <span>Магазин</span>
            </>
          )}
        </nav>

        {selectedStore ? (
          <StoreDetails store={selectedStore} onBack={() => setSelectedStoreId(null)} />
        ) : (
          <StoreSearch
            query={query}
            setQuery={setQuery}
            openOnly={openOnly}
            setOpenOnly={setOpenOnly}
            stores={visibleStores}
            onSelect={openStore}
          />
        )}
      </div>
    </main>
  );
}

function StoreSearch({ query, setQuery, openOnly, setOpenOnly, stores, onSelect }) {
  return (
    <>
      <h1 className="shops-title">Знайти найближчий магазин</h1>

      <form className="shops-search" onSubmit={event => event.preventDefault()}>
        <input
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          aria-label="Пошук магазину"
        />
        <button type="submit">Пошук</button>
        <button
          type="button"
          className={openOnly ? 'is-active' : ''}
          onClick={() => setOpenOnly(value => !value)}
        >
          Зараз відчинено
        </button>
      </form>

      <section className="shops-search-layout">
        <StoreMap stores={stores} onSelect={onSelect} />

        <aside className="shops-help-card">
          <h2>Виберіть магазин</h2>
          <p>
            Щоб вибрати магазин, натисніть відповідний значок на карті. Після вибору значка магазина масштаб карти збільшується на цій ділянці.
          </p>
          <div className="shops-store-list" aria-label="Список магазинів">
            {stores.map(store => (
              <button key={store.id} type="button" onClick={() => onSelect(store)}>
                <strong>{store.name}</strong>
                <span>{store.address}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}

function StoreDetails({ store, onBack }) {
  return (
    <section className="shops-detail">
      <div className="shops-detail__intro">
        <h1>{store.name}</h1>
        <p>{store.address}</p>
        <button type="button" onClick={onBack}>Обрати інший магазин</button>
      </div>

      <div className="shops-detail__layout">
        <StoreMap stores={[store]} selectedStore={store} onSelect={() => {}} detail />

        <div className="shops-detail__side">
          <img className="shops-detail__photo" src="/images/shops/shop-interior.png" alt="" />
          <WorkingHours store={store} />
        </div>
      </div>
    </section>
  );
}

function StoreMap({ stores, selectedStore, onSelect, detail = false }) {
  return (
    <div className={`shops-map ${detail ? 'shops-map--detail' : ''}`}>
      <img
        src={detail ? '/images/shops/shop-detail-map.png' : '/images/shops/shops-map.png'}
        alt=""
      />
      {stores.map(store => (
        <button
          key={store.id}
          type="button"
          className={`shops-map__marker ${selectedStore?.id === store.id ? 'is-selected' : ''}`}
          style={{ left: store.marker.left, top: store.marker.top }}
          onClick={() => onSelect(store)}
          aria-label={`Обрати ${store.name}`}
          title={store.name}
        >
          <span>{store.id}</span>
        </button>
      ))}
      {detail && selectedStore && (
        <article className="shops-map-popup">
          <button type="button" aria-label="Закрити">×</button>
          <img src="/images/shops/shop-interior.png" alt="" />
          <h3>{selectedStore.name}</h3>
          <p>{selectedStore.address}</p>
          <p>Тел. <a href={`tel:${selectedStore.phone}`}>{selectedStore.phone}</a></p>
          <strong>Робочі години</strong>
          <div>
            <span>Сьогодні</span>
            <span>{scheduleRange(selectedStore.schedule.mon)}</span>
          </div>
          <div>
            <span>Завтра</span>
            <span>{scheduleRange(selectedStore.schedule.tue)}</span>
          </div>
        </article>
      )}
    </div>
  );
}

function WorkingHours({ store }) {
  return (
    <aside className="shops-hours">
      <h2>Робочі години</h2>
      <dl>
        {DAYS.map(([key, label]) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>{scheduleRange(store.schedule[key])}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export default ShopsPage;
