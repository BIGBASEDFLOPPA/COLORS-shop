import { cartStore } from '../../store/cartStore.js';
import { productStore } from '../../store/productStore.js';
import renderLoader from '../Loader/loader.js';

export default async function renderCatalog(filters = {}, sort = '', page = 1) {
    const container = document.createElement('section');
    container.className = 'catalog';

    const loader = renderLoader();
    document.body.appendChild(loader);

    try {
        const allProducts = await productStore.load();

        loader.remove();

        let filtered = allProducts.filter(product => {
            for (const key in filters) {
                if (filters[key] === true && product[key] !== true) {
                    return false;
                }
            }
            return true;
        });

        switch (sort) {
            case 'expensive':
                filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'cheap':
                filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
                break;
            case 'new':
                filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
                break;
        }

        const PAGE_SIZE = 25;
        const currentProducts = filtered.slice(0, page * PAGE_SIZE);
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

        const list = document.createElement('div');
        list.className = 'catalog__list';

        currentProducts.forEach(product => {
            const card = document.createElement('div');
            card.className = 'catalog__card';

            card.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="catalog__image" />
                <div class="catalog__name">${product.name}</div>
                <div class="catalog__footer">
                    <div class="catalog__price">${product.price} ₽</div>
                    <button class="catalog__add" aria-label="Добавить в корзину">+</button>
                </div>
            `;

            const addBtn = card.querySelector('.catalog__add');
            addBtn.addEventListener('click', () => {
                cartStore.add({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image
                });
            });

            list.appendChild(card);
        });

        container.appendChild(list);
        container.dataset.totalCount = filtered.length;

        if (page < totalPages) {
            const moreBtn = document.createElement('button');
            moreBtn.className = 'catalog__more';
            moreBtn.textContent = 'Показать ещё';

            moreBtn.addEventListener('click', async () => {
                const updated = await renderCatalog(filters, sort, page + 1);
                container.replaceWith(updated);
            });

            const pagination = document.createElement('div');
            pagination.className = 'catalog__pagination';
            pagination.appendChild(moreBtn);
            container.appendChild(pagination);
        }

    } catch (error) {
        loader.remove();
        container.innerHTML = '<p>Ошибка загрузки товаров</p>';
        console.error(error);
    }

    return container;
}
