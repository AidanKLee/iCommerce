const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
// const { parser } = require('../controller/middleware');
const { products } = controller;

route.get('/:category', products.get);

route.get('/item/:itemId', (req, res, next) => {
    console.log(req.query.cart_id)
    if (!req.query.cart_id) {
        products.getByItemId(req, res, next);
    } else {
        products.getByCartItemId(req, res, next)
    }
}, products.getDataAndItems);

route.get('/product/:productId', products.getById, products.getDataAndItems);

module.exports = route;