const express = require('express');
const route = express.Router();
const controller = require('../controller');
// const { parser } = require('../controller/middleware');
const { products } = controller;

route.get('/:category', products.get);

route.get('/product/:productId', products.getById, products.getDataAndItems);

module.exports = route;