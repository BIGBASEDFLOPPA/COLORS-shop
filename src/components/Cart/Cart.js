import { cartStore } from '../../store/cartStore.js';

export default function renderCart() {
    const cartWrapper = document.createElement('aside');
    cartWrapper.className = 'cart';

    cartWrapper.innerHTML = `
    <div class="cart__header">
      <h2 class="cart__title">Корзина</h2>
      <button class="cart__close" aria-label="Закрыть корзину">
        <img src="/COLORS-shop/icons/iconClose.svg" alt="Закрыть" />
      </button>
    </div>

    <div class="cart__summary">
      <span class="cart__count"></span>
      <button class="cart__clear">очистить список</button>
    </div>

    <div class="cart__content"></div>

    <div class="cart__footer">
      <div class="cart__total">
        <span class="cart__total-label">Итого</span>
        <span class="cart__total-sum">0 ₽</span>
      </div>
      <button class="cart__checkout">оформить заказ</button>
    </div>
  `;

    const closeBtn = cartWrapper.querySelector('.cart__close');
    const content = cartWrapper.querySelector('.cart__content');
    const clearBtn = cartWrapper.querySelector('.cart__clear');
    const summaryCount = cartWrapper.querySelector('.cart__count');
    const totalSum = cartWrapper.querySelector('.cart__total-sum');

    function renderItems(items) {
        if (!items.length) {
            content.innerHTML = '<p class="cart__empty">Корзина пуста</p>';
            summaryCount.textContent = '';
            totalSum.textContent = '0 ₽';
            return;
        }

        content.innerHTML = '';

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        summaryCount.textContent = `${totalItems} товар${totalItems === 1 ? '' : totalItems < 5 ? 'а' : 'ов'}`;
        totalSum.textContent = `${totalPrice.toLocaleString()} ₽`;

        items.forEach(item => {
            const product = document.createElement('div');
            product.className = 'cart__product';

            product.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart__product-img" />
        <div class="cart__product-details">
          <p class="cart__product-name">${item.name}</p>
          <p class="cart__product-price">${item.price} ₽</p>
        </div>
        <div class="cart__product-actions">
          <button class="cart__btn cart__btn--minus" aria-label="Минус">−</button>
          <span class="cart__product-qty">${item.quantity}</span>
          <button class="cart__btn cart__btn--plus" aria-label="Плюс">+</button>
        </div>
        <button class="cart__btn cart__btn--remove" aria-label="Удалить">
          <img src="/COLORS-shop/icons/iconRemove.svg.svg" alt="Удалить" />
        </button>
      `;

            product.querySelector('.cart__btn--minus').addEventListener('click', () => {
                cartStore.decrease(item.id);
            });

            product.querySelector('.cart__btn--plus').addEventListener('click', () => {
                cartStore.increase(item.id);
            });

            product.querySelector('.cart__btn--remove').addEventListener('click', () => {
                cartStore.remove(item.id);
            });

            content.appendChild(product);
        });
    }

    cartStore.subscribe(items => {
        renderItems(items);
    });

    let onClose = null;

    closeBtn.addEventListener('click', () => {
        cartWrapper.classList.remove('cart--open');
        if (typeof onClose === 'function') onClose();
    });

    clearBtn.addEventListener('click', () => {
        cartStore.clear();
    });

    return {
        element: cartWrapper,
        open() {
            cartWrapper.classList.add('cart--open');
        },
        close() {
            cartWrapper.classList.remove('cart--open');
        },
        setOnCloseCallback(fn) {
            onClose = fn;
        }
    };
}
