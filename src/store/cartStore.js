let cart = JSON.parse(localStorage.getItem('cart')) || [];
const subscribers = [];

function save() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function notify() {
    save();
    subscribers.forEach(cb => cb([...cart]));
}

export const cartStore = {
    get() {
        return [...cart];
    },

    add(product) {
        const found = cart.find(item => item.id === product.id);
        if (found) {
            found.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        notify();
    },

    remove(id) {
        const index = cart.findIndex(item => item.id === id);
        if (index !== -1) {
            cart.splice(index, 1);
            notify();
        }
    },

    increase(id) {
        const item = cart.find(p => p.id === id);
        if (item) {
            item.quantity++;
            notify();
        }
    },

    decrease(id) {
        const item = cart.find(p => p.id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
        } else {
            this.remove(id);
            return;
        }
        notify();
    },

    clear() {
        cart.length = 0;
        notify();
    },

    subscribe(cb) {
        subscribers.push(cb);
        cb([...cart]);
    }
};
