import { Router } from 'express';
import CartManager from '../dao/cart/managers/CartManager.js';
import __dirname from '../utill.js';
import path from 'path';
import Swal from 'sweetalert2';
import fs from 'fs'

const routers = Router();
const filePath = path.resolve(
    __dirname,
    'dao',
    'cart',
    'files',
    'carrito.json'
);

const cartManagers = new CartManager(filePath);


routers.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    try {

        const cartData = fs.readFileSync(filePath, 'utf-8');
        const carts = JSON.parse(cartData);

        if (!carts[cid]) {
            carts[cid] = { products: [] };
        }

        const cart = carts[cid];
        const existingProduct = cart.products.find(product => product.productId === pid);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId: pid, quantity });
        }

        fs.writeFileSync(filePath, JSON.stringify(carts, null, '\t'));

        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        res.status(500).json({ error: error.message });
    }
});


routers.get('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const data = await cartManagers.readCartData();

        if (data[cid]) {
            const cartContents = data[cid].products;
            res.status(200).json(cartContents);
        } else {
            res.status(404).json({ error: 'El carrito no existe' });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ error: error.message });
    }
});

export default routers