const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { products, seller } = controller;
const { helper, parser } = require('../controller/middleware')

route.get('/:userId/products/:category', products.get);

route.post('/:userId/products', parser.json, products.create, products.createItems);

route.post('/:userId/products/:productId/items', parser.json, products.createItems);

route.put('/:userId/products/:productId', parser.json, products.edit);

route.delete('/:userId/products/images', products.purgeUnusedImages);

route.get('/:userId/orders', seller.selectAllOrders, helper.getOrdersData);

route.put('/:userId/orders/:orderId', seller.updateSellerOrder);

route.post('/:userId/review', parser.json, helper.submitReview);

module.exports = route;