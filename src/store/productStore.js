import axios from 'axios';

let allProducts = [];
let subscribers = [];

export const productStore = {
    async load() {
        if (allProducts.length) return allProducts;

        const response = await axios.get('https://68779ab1dba809d901f023a6.mockapi.io/products');
        allProducts = response.data;
        subscribers.forEach(cb => cb([...allProducts]));
        return allProducts;
    },

    getAll() {
        return [...allProducts];
    },

    subscribe(cb) {
        subscribers.push(cb);
        cb([...allProducts]);
    }
};
