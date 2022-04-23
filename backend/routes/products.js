const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { parser } = require('../controller/middleware/index.js');
// const { parser } = require('../controller/middleware');
const { products } = controller;

route.get('/:category', products.get);

route.post('/items', parser.json, (req, res, next) => {
    if (!req.query.cart_id) {
        products.getByItemIdList(req, res, next);
    } else {
        products.getByCartItemIdList(req, res, next)
    }
}, products.getDataAndItems);

route.get('/items/:itemId', (req, res, next) => {
    if (!req.query.cart_id) {
        products.getByItemId(req, res, next);
    } else {
        products.getByCartItemId(req, res, next)
    }
}, products.getDataAndItems);

route.get('/product/:productId', products.getById, products.getDataAndItems);

module.exports = route;