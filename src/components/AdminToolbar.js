import React from 'react';
import './AdminToolbar.css';

/**
 * AdminToolbar — універсальна панель для всіх адмін-сторінок
 *
 * Props:
 *   title        — заголовок сторінки (string)
 *   count        — кількість елементів (number)
 *   searchTerm   — значення пошуку (string)
 *   onSearchChange — колбек зміни пошуку (fn)
 *   onAdd        — колбек кнопки "Додати" (fn), якщо не передано — кнопка не рендериться
 *
 *   filters      — масив фільтрів (array):
 *     [
 *       {
 *         key: 'category',           // ключ для ідентифікації
 *         label: 'Категорія',        // плейсхолдер (коли нічого не вибрано)
 *         value: selectedCategory,   // поточне значення
 *         onChange: fn,              // колбек зміни
 *         options: ['Столи', 'Крісла', ...] // масив рядків або { value, label }
 *       },
 *       ...
 *     ]
 */
const AdminToolbar = ({ title, count, searchTerm, onSearchChange, onAdd, filters = [] }) => {
    return (
        <div className="admin-toolbar">
            {/* Рядок: Заголовок + кнопка Додати */}
            <div className="toolbar-header">
                <h2 className="toolbar-title">
                    {title} <span className="toolbar-count">{count}</span>
                </h2>
                {onAdd && (
                    <button className="add-button" onClick={onAdd}>Додати</button>
                )}
            </div>

            {/* Рядок: Пошук + фільтри */}
            <div className="toolbar-actions">
                <div className="search-container">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Швидкий пошук"
                        value={searchTerm}
                        onChange={e => onSearchChange(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    {filters.map(filter => (
                        <select
                            key={filter.key}
                            className="filter-select"
                            value={filter.value}
                            onChange={e => filter.onChange(e.target.value)}
                        >
                            <option value="">{filter.label}</option>
                            {filter.options.map(opt => {
                                // Підтримуємо як рядки, так і об'єкти { value, label }
                                const val = typeof opt === 'object' ? opt.value : opt;
                                const lbl = typeof opt === 'object' ? opt.label : opt;
                                return <option key={val} value={val}>{lbl}</option>;
                            })}
                        </select>
                    ))}

                    <div className="filter-plus" onClick={() => alert("Додаткові фільтри в розробці")}>
                        Фільтр
                        <span className="filter-plus-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
                                <rect y="5" width="12" height="2" fill="#231F20" />
                                <rect x="5" width="2" height="12" fill="#231F20" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminToolbar;