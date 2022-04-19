const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { customer, products } = controller;

route.post('/:customerId/save-item/:itemId', customer.saveItem, products.getByItemId, products.getDataAndItems);

route.post('/:customerId/cart/:cartId/:itemId', customer.addCartItem, products.getByCartItemId, products.getDataAndItems);

route.put('/:customerId/cart/:cartId/:itemId', customer.updateCartItem, products.getByCartItemId, products.getDataAndItems);

route.delete('/:customerId/cart/:cartId/:itemId', customer.deleteCartItem);

module.exports = route;