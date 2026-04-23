import React, { useState } from 'react';
import { products as initialProducts } from './products';
import './AdminPage.css';

const AdminPage = () => {
  const [productsList, setProductsList] = useState(initialProducts);
  const [view, setView] = useState('list'); // 'list' або 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);

  // Видалення
  const handleDelete = (id) => {
    if (window.confirm('Ви впевнені, що хочете видалити цей товар?')) {
      setProductsList(productsList.filter(p => p.id !== id));
    }
  };

  // Перехід до редагування
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setView('edit');
  };

  // Перехід до додавання нового
  const handleAdd = () => {
    setCurrentProduct({
      id: Date.now(),
      name: '', brand: '', price: '', article: '', category: 'kitchen',
      description: '', characteristics: [{ label: '', value: '' }], images: []
    });
    setView('edit');
  };

  return (
    <div className="admin-container">
      {/* ЛІВА ПАНЕЛЬ (Сайдбар) */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
           <img src="/logo.png" alt="HYGGY" />
           <a href="/" className="go-to-site">Перейти на сайт</a>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active">Товари</div>
          <div className="nav-item">Склади</div>
          <div className="nav-item">Магазини</div>
          <div className="nav-item">Співробітники</div>
          <div className="nav-item">Клієнти</div>
          <div className="nav-item">Замовлення</div>
        </nav>
      </aside>

      {/* ОСНОВНИЙ КОНТЕНТ */}
      <main className="admin-main">
        {view === 'list' ? (
          <div className="admin-list-view">
            <header className="admin-header">
              <div className="header-left">
                <h1>Товари <span>{productsList.length}</span></h1>
                <div className="admin-search">
                  <input type="text" placeholder="Швидкий пошук" />
                </div>
              </div>
              <button className="btn-add" onClick={handleAdd}>Додати</button>
            </header>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Назва</th>
                  <th>Виробник</th>
                  <th>Ціна</th>
                  <th>Рейтинг</th>
                  <th>Доставка</th>
                  <th>Дії</th>
                </tr>
              </thead>
              <tbody>
                {productsList.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.brand}</td>
                    <td>{p.price}₴</td>
                    <td>⭐⭐⭐⭐⭐</td>
                    <td>{p.hasDelivery ? '✅' : '❌'}</td>
                    <td className="table-actions">
                      <button onClick={() => handleEdit(p)}>✏️</button>
                      <button onClick={() => handleDelete(p.id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-edit-view">
            <header className="admin-header">
               <button className="btn-back" onClick={() => setView('list')}>← Назад</button>
               <h1>Редагування товару</h1>
            </header>
            
            <form className="admin-form">
              <div className="form-group">
                <input type="text" placeholder="Введіть артикул..." defaultValue={currentProduct?.article} />
                <input type="text" placeholder="Введіть назву товару..." defaultValue={currentProduct?.name} />
                <select defaultValue={currentProduct?.category}>
                  <option value="kitchen">Кухня</option>
                  <option value="bedroom">Спальня</option>
                </select>
                <textarea placeholder="Короткий опис..." defaultValue={currentProduct?.description}></textarea>
              </div>

              <div className="form-row">
                <input type="number" placeholder="Введіть ціну..." defaultValue={currentProduct?.price} />
                <label><input type="checkbox" /> Завжди низька ціна</label>
                <input type="text" placeholder="Введіть % знижки..." />
              </div>

              <h3>Характеристики</h3>
              {currentProduct?.characteristics?.map((char, index) => (
                <div className="form-row char-row" key={index}>
                  <input type="text" placeholder="Назва" defaultValue={char.label} />
                  <input type="text" placeholder="Значення" defaultValue={char.value} />
                </div>
              ))}
              
              <div className="form-actions">
                <button type="button" className="btn-secondary">Додати характеристику</button>
                <button type="button" className="btn-save" onClick={() => setView('list')}>Зберегти</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;