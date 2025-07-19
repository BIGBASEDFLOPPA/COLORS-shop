import renderSelectFilter from '../SelectFilter/SelectFilter.js';

export default function renderToolbar({
                                          count = 0,
                                          currentSort = '',
                                          onSortChange,
                                          onFiltersClick
                                      }) {
    const wrapper = document.createElement('div');
    wrapper.className = 'catalog-toolbar';

    const title = document.createElement('h1');
    title.className = 'catalog-toolbar__title';
    title.textContent = 'Краски';

    const controlsRow = document.createElement('div');
    controlsRow.className = 'catalog-toolbar__controls-row';

    const countEl = document.createElement('div');
    countEl.className = 'catalog-toolbar__count';
    countEl.textContent = `Найдено: ${count} товаров`;

    const filtersBtn = document.createElement('button');
    filtersBtn.className = 'toolbar__filters-btn';
    filtersBtn.textContent = 'Фильтры';
    filtersBtn.type = 'button';

    filtersBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof onFiltersClick === 'function') onFiltersClick();
    });

    const selectFilter = renderSelectFilter(currentSort, onSortChange);
    selectFilter.element.classList.add('select-filter--custom');

    controlsRow.appendChild(countEl);
    controlsRow.appendChild(filtersBtn);
    controlsRow.appendChild(selectFilter.element);

    wrapper.appendChild(title);
    wrapper.appendChild(controlsRow);

    return {
        element: wrapper,
        selectFilter,
        updateCount(newCount) {
            const plural = getPlural(newCount, 'товар', 'товара', 'товаров');
            countEl.textContent = `Найдено: ${newCount} ${plural}`;
        },
        setSort(value) {
            const buttonText = selectFilter.element.querySelector('.select-filter__text');
            const options = [
                { label: 'Сначала дорогие', value: 'expensive' },
                { label: 'Сначала недорогие', value: 'cheap' },
                { label: 'Сначала популярные', value: 'popular' },
                { label: 'Сначала новые', value: 'new' }
            ];
            const selectedOption = options.find(o => o.value === value);
            if (buttonText && selectedOption) {
                buttonText.textContent = selectedOption.label;
            }
        }
    };
}

function getPlural(n, one, few, many) {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
    return many;
}
