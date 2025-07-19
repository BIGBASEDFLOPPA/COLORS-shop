import html from './Header.html?raw';
import { cartStore } from '../../store/cartStore.js';

export default function renderHeader() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();

    const headerEl = wrapper.firstChild;
    const cartBtn = headerEl.querySelector('.header__cart-btn');
    const cartCount = cartBtn.querySelector('.header__cart-count');

    cartStore.subscribe(items => {
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalCount;
        cartBtn.classList.toggle('has-items', totalCount > 0);
    });

    cartBtn.addEventListener('click', () => {
        headerEl.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }));
    });

    const burgerBtn = headerEl.querySelector('.header__burger');
    const bottomRow = headerEl.querySelector('.header__bottom-row');

    burgerBtn.addEventListener('click', () => {
        bottomRow.classList.toggle('open');
        burgerBtn.classList.toggle('header__burger--active');
    });

    return headerEl;
}
