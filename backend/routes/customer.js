const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { helper, parser } = require('../controller/middleware/index.js');
const { customer, products } = controller;

route.post('/:customerId/save-item/:itemId', customer.saveItem, products.getByItemId, products.getDataAndItems);

route.post('/:customerId/cart/:cartId/:itemId', customer.addCartItem, products.getByCartItemId, products.getDataAndItems);

route.put('/:customerId/cart/:cartId/:itemId', customer.updateCartItem, products.getByCartItemId, products.getDataAndItems);

route.delete('/:customerId/cart/:cartId/:itemId', customer.deleteCartItem);

route.get('/:customerId/addresses', customer.selectAddresses);

route.post('/:customerId/addresses', parser.json, customer.insertAddress);

route.get('/:customerId/orders', customer.selectAllOrders, helper.getOrdersData);

route.get('/:customerId/orders/:orderId', customer.selectOrderById, helper.getOrdersData);

route.post('/:customerId/orders/:orderId', parser.json, customer.submitOrder);

route.put('/:customerId/orders/:orderId', customer.confirmPayment);

route.delete('/:customerId/orders/:orderId', customer.cancelOrderItems);

module.exports = route;