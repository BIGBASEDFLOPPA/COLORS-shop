export default function renderSelectFilter(initialValue = '', onChange, onOpen = () => {}, onClose = () => {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'select-filter';

    const button = document.createElement('button');
    button.className = 'select-filter__button';
    button.type = 'button';

    const buttonText = document.createElement('span');
    buttonText.className = 'select-filter__text';
    button.appendChild(buttonText);

    const imgArrow = document.createElement('img');
    imgArrow.className = 'select-filter__arrow';
    imgArrow.src = '/COLORS-shop/icons/iconOpenSelect.svg';
    imgArrow.alt = 'arrow icon';
    button.appendChild(imgArrow);

    const list = document.createElement('ul');
    list.className = 'select-filter__list';
    list.style.display = 'none';

    const options = [
        { label: 'Сначала дорогие', value: 'expensive' },
        { label: 'Сначала недорогие', value: 'cheap' },
        { label: 'Сначала популярные', value: 'popular' },
        { label: 'Сначала новые', value: 'new' }
    ];

    let selectedValue = initialValue || options[0].value;
    buttonText.textContent = options.find(o => o.value === selectedValue)?.label || '';

    function closeDropdown() {
        wrapper.classList.remove('select-filter--open');
        list.style.display = 'none';
        onClose();
        wrapper.dispatchEvent(new CustomEvent('select:close', { bubbles: true }));
    }

    function openDropdown() {
        wrapper.classList.add('select-filter--open');
        list.style.display = 'block';
        onOpen();
        wrapper.dispatchEvent(new CustomEvent('select:open', { bubbles: true }));
    }

    function toggleDropdown() {
        if (wrapper.classList.contains('select-filter--open')) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    function selectOption(value) {
        selectedValue = value;
        buttonText.textContent = options.find(o => o.value === value)?.label || '';
        onChange(value);
        closeDropdown();
        renderOptions();
    }

    function renderOptions() {
        list.innerHTML = '';
        options
            .filter(({ value }) => value !== selectedValue)
            .forEach(({ label, value }) => {
                const li = document.createElement('li');
                li.className = 'select-filter__option';
                li.textContent = label;
                li.tabIndex = 0;
                li.addEventListener('click', () => selectOption(value));
                li.addEventListener('keydown', e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        selectOption(value);
                    }
                });
                list.appendChild(li);
            });
    }

    button.addEventListener('click', e => {
        e.stopPropagation();
        toggleDropdown();
    });

    document.addEventListener('click', e => {
        if (!wrapper.contains(e.target)) {
            closeDropdown();
        }
    });

    renderOptions();

    wrapper.appendChild(button);
    wrapper.appendChild(list);

    return {
        element: wrapper,
        open: openDropdown,
        close: closeDropdown,
        getValue: () => selectedValue
    };
}
