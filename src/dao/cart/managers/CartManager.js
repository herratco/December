import fs from 'fs';

export default class CartManager {
    constructor(path) {
        this.path = path;
        if (!fs.existsSync(this.path)) {
            const initialData = { carts: [] };
            fs.writeFileSync(this.path, JSON.stringify(initialData, null, '\t'));
        }
    }

    readCartData = async (searchById) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            const cart = carts.find(p => p.id === searchById);

            if (cart) {
                return cart;
            } else {
                throw new Error("El cart no existe");
            }
        } catch (error) {
            console.error("Error al obtener el cart:", error);
            throw error;
        }
    }

    readCartData = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                if (data) {
                    return JSON.parse(data);
                }
            }
            return null;
        } catch (error) {
            console.error("Error al obtener datos del carrito:", error);
            throw error;
        }
    }

    saveCartData = async (data) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(data, null, '\t'));
        } catch (error) {
            console.error("Error al guardar datos del carrito:", error);
            throw error;
        }
    }
    generateUniqueId(products) {
        const lastProductId = products.length > 0 ? products[products.length - 1].id : 0;
        return lastProductId + 1;
    }

    cartProduct = async (cartId, product) => {
        try {
            let carts = [];

            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                if (data) {
                    carts = JSON.parse(data).carts || [];
                }
            }


            let cart = carts.find(c => c.id === cartId);

            if (!cart) {

                cart = { id: cartId, products: [] };
                carts.push(cart);
            }

            let existingProduct = cart.products.find(p => p.productId === product.productId);

            if (existingProduct) {

                existingProduct.quantity += product.quantity;
            } else {

                cart.products.push(product);
            }

            const updatedData = { carts };
            await fs.promises.writeFile(this.path, JSON.stringify(updatedData, null, '\t'));

            return product;
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error);
            throw error;
        }
    }
}
