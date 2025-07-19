import './assets/scss/main.scss';

import renderHeader from './components/Header/Header.js';
import renderSlider from './components/Slider/Slider.js';
import renderSwitchFilters from './components/SwitchFilter/switchfilters.js';
import renderToolbar from './components/Toolbar/toolbar.js';
import renderCatalog from './components/Catalog/catalog.js';
import renderCart from './components/Cart/cart.js';

const app = document.getElementById('app');

const header = renderHeader();
app.appendChild(header);

const breadcrumbs = document.createElement('nav');
breadcrumbs.className = 'breadcrumbs';
breadcrumbs.innerHTML = `
  <a href="#">Главная</a>
  <span class="separator">•</span>
  <a href="#">Продукты</a>
  <span class="separator">•</span>
  <span>Краски</span>
`;
app.appendChild(breadcrumbs);

const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

const main = document.createElement('main');
main.className = 'main';
app.appendChild(main);

const slider = renderSlider();
main.appendChild(slider);

const contentWrapper = document.createElement('div');
contentWrapper.className = 'content-wrapper';
main.appendChild(contentWrapper);

const layout = document.createElement('div');
layout.className = 'layout';
layout.style.display = 'flex';

const catalogWrapper = document.createElement('div');
catalogWrapper.className = 'catalog__container';

let currentFilters = {};
let currentSort = '';
let currentPage = 1;

const filters = renderSwitchFilters(
    (filtersObj) => {
        currentFilters = filtersObj;
        currentPage = 1;
        rerenderCatalog(currentPage);
    },
    () => app.dispatchEvent(new CustomEvent('filters:open', { bubbles: true })),
    () => app.dispatchEvent(new CustomEvent('filters:close', { bubbles: true }))
);

layout.appendChild(filters.element);
layout.appendChild(catalogWrapper);
contentWrapper.appendChild(layout);

function toggleFilters() {
    if (filters.element.classList.contains('switchfilters--open')) {
        filters.close();
    } else {
        filters.open();
    }
}

const toolbar = renderToolbar({
    count: 0,
    currentSort,
    onSortChange: (sortValue) => {
        currentSort = sortValue;
        currentPage = 1;
        rerenderCatalog(currentPage);
    },
    onFiltersClick: () => toggleFilters()
});

contentWrapper.insertBefore(toolbar.element, layout);

const selectFilter = toolbar.selectFilter;

const { element: cartEl, open: openCart, close: closeCart, setOnCloseCallback } = renderCart();
document.body.appendChild(cartEl);

const originalFiltersOpen = filters.open.bind(filters);
const originalFiltersClose = filters.close.bind(filters);
filters.open = function () {
    originalFiltersOpen();
    app.dispatchEvent(new CustomEvent('filters:open', { bubbles: true }));
};
filters.close = function () {
    originalFiltersClose();
    app.dispatchEvent(new CustomEvent('filters:close', { bubbles: true }));
};

const originalOpenCart = openCart;
const originalCloseCart = closeCart;
function openCartWrapper() {
    originalOpenCart();
    app.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }));
}
function closeCartWrapper() {
    originalCloseCart();
    app.dispatchEvent(new CustomEvent('cart:close', { bubbles: true }));
}

const originalSelectOpen = selectFilter.open.bind(selectFilter);
const originalSelectClose = selectFilter.close.bind(selectFilter);
selectFilter.open = function () {
    originalSelectOpen();
    app.dispatchEvent(new CustomEvent('select:open', { bubbles: true }));
};
selectFilter.close = function () {
    originalSelectClose();
    app.dispatchEvent(new CustomEvent('select:close', { bubbles: true }));
};

setOnCloseCallback(() => {
    closeCartWrapper();
});

['cart:open', 'cart:close', 'filters:open', 'filters:close', 'select:open', 'select:close'].forEach(eventName => {
    app.addEventListener(eventName, () => {
        updateOverlay();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.querySelector('.header__cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            openCartWrapper();
        });
    }
});

const updateOverlay = (() => {
    let busy = false;
    return () => {
        if (busy) return;
        busy = true;

        const anyOpen =
            filters.element.classList.contains('switchfilters--open') ||
            cartEl.classList.contains('cart--open') ||
            selectFilter.element.classList.contains('select-filter--open');

        if (anyOpen) {
            overlay.classList.add('active');
        } else {
            overlay.classList.remove('active');
        }

        busy = false;
    };
})();

overlay.addEventListener('click', () => {
    if (filters.element.classList.contains('switchfilters--open')) filters.close();
    if (cartEl.classList.contains('cart--open')) closeCartWrapper();
    if (selectFilter.element.classList.contains('select-filter--open')) selectFilter.close();
});

async function rerenderCatalog(page = 1) {
    const catalog = await renderCatalog(currentFilters, currentSort, page);
    toolbar.updateCount(Number(catalog.dataset.totalCount));
    catalogWrapper.innerHTML = '';
    catalogWrapper.appendChild(catalog);

    const moreBtn = catalogWrapper.querySelector('.catalog__more');
    if (moreBtn) {
        moreBtn.addEventListener('click', () => {
            currentPage++;
            rerenderCatalog(currentPage);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    rerenderCatalog(currentPage);
});

const pageEnd = document.createElement('div');
pageEnd.className = 'page-end';
main.appendChild(pageEnd);
