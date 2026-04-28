import React from 'react';
import './AdminToolbar.css';

const getOptionValue = (option) => (typeof option === 'object' ? option.value : option);
const getOptionLabel = (option) => (typeof option === 'object' ? option.label : option);

const AdminToolbar = ({
    title,
    count,
    searchTerm,
    onSearchChange,
    onAdd,
    filters = [],
    children,
    onFilterClick,
    showFilterButton = true,
}) => {
    return (
        <div className="admin-toolbar">
            <div className="toolbar-header">
                <h2 className="toolbar-title">
                    {title} <span className="toolbar-count">{count}</span>
                </h2>
                {onAdd && (
                    <button type="button" className="add-button" onClick={onAdd}>Додати</button>
                )}
            </div>

            <div className="toolbar-actions">
                <label className="search-container">
                    <svg className="search-icon" aria-hidden="true" viewBox="0 0 24 24">
                        <path d="M10.75 5.5a5.25 5.25 0 1 0 0 10.5 5.25 5.25 0 0 0 0-10.5ZM4 10.75a6.75 6.75 0 1 1 12.05 4.18l3.51 3.51-1.06 1.06-3.51-3.51A6.75 6.75 0 0 1 4 10.75Z" />
                    </svg>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Швидкий пошук"
                        value={searchTerm || ''}
                        onChange={(event) => onSearchChange?.(event.target.value)}
                    />
                </label>

                <div className="filter-group">
                    {filters.map((filter) => {
                        const options = filter.options || [];
                        const selectedOption = options.find((option) => String(getOptionValue(option)) === String(filter.value));
                        const visibleLabel = filter.value ? getOptionLabel(selectedOption) || filter.label : filter.label;

                        return (
                            <label key={filter.key} className="filter-select-wrap">
                                <span className="filter-select-label">{visibleLabel}</span>
                                <select
                                    className="filter-select"
                                    aria-label={filter.label}
                                    value={filter.value}
                                    onChange={(event) => filter.onChange(event.target.value)}
                                >
                                    <option value="">{filter.allLabel || `Усі ${String(filter.label).toLowerCase()}`}</option>
                                    {options.map((option) => {
                                        const value = getOptionValue(option);
                                        const label = getOptionLabel(option);

                                        return <option key={value} value={value}>{label}</option>;
                                    })}
                                </select>
                            </label>
                        );
                    })}

                    {children}

                    {showFilterButton && (
                        <button
                            type="button"
                            className="filter-plus"
                            onClick={onFilterClick || (() => {})}
                        >
                            <span>Фільтр</span>
                            <span className="filter-plus-icon" aria-hidden="true">+</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminToolbar;
