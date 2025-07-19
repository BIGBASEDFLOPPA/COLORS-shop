export default function renderSwitchFilters(onChange, onOpen, onClose) {
    const aside = document.createElement('aside');
    aside.className = 'switchfilters';

    const filters = [
        { label: 'Новинки', key: 'isNew' },
        { label: 'Есть в наличии', key: 'inStock' },
        { label: 'Контрактные', key: 'contract' },
        { label: 'Эксклюзивные', key: 'exclusive' },
        { label: 'Распродажа', key: 'sale' },
    ];

    const activeFilters = {};

    const list = document.createElement('div');
    list.className = 'switchfilters__list';

    filters.forEach(({ label, key }) => {
        const item = document.createElement('label');
        item.className = 'switchfilters__item';

        item.innerHTML = `
          <div class="switchfilters__switch">
            <input type="checkbox" class="switchfilters__checkbox" data-key="${key}" />
            <span class="switchfilters__slider"></span>
          </div>
          <span class="switchfilters__label">${label}</span>
        `;

        const checkbox = item.querySelector('.switchfilters__checkbox');
        checkbox.addEventListener('change', () => {
            activeFilters[key] = checkbox.checked;
            if (typeof onChange === 'function') {
                onChange({ ...activeFilters });
            }
        });

        list.appendChild(item);
    });

    aside.appendChild(list);

    function open() {
        aside.classList.add('switchfilters--open');
        if (typeof onOpen === 'function') {
            onOpen();
        }
    }

    function close() {
        aside.classList.remove('switchfilters--open');
        if (typeof onClose === 'function') {
            onClose();
        }
    }

    return {
        element: aside,
        open,
        close,
    };
}
