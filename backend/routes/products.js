const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { parser, helper, validate } = require('../controller/middleware');
const { products } = controller;

route.get('/:category',
    validate.stringIfExists('category'),
    validate.queryStringArray('attributes'),
    validate.numberIfExists('limit'),
    validate.numberIfExists('page'),
    validate.stringIfExists('query'),
    validate.stringIfExists('sort'),
    validate.stringIsValidOptionIfExists('sort', ['most-viewed', 'name-asc', 'name-desc', 'popular', 'price-asc', 'price-desc', 'top-rated']),
    validate.handleErrors,
    products.get
);

route.get('/product/:productId',
    validate.string('productId'),
    validate.uuid('productId'),
    validate.handleErrors,
    products.getById,
    products.getDataAndItems
);

route.post('/items',
    parser.json,
    validate.stringIfExists('cart_id'),
    validate.UUIDIfExists('cart_id'),
    validate.handleErrors,
    helper.isCustomerCart,
    (req, res, next) => {
        if (!req.query.cart_id) {
            products.getByItemIdList(req, res, next);
        } else {
            products.getByCartItemIdList(req, res, next)
        }
    },
    products.getDataAndItems
);

route.get('/items/:itemId',
    validate.stringIfExists('item_id'),
    validate.stringIfExists('cart_id'),
    validate.UUIDIfExists('item_id'),
    validate.UUIDIfExists('cart_id'),
    validate.handleErrors,
    helper.isCustomerCart,
    (req, res, next) => {
        if (!req.query.cart_id) {
            products.getByItemId(req, res, next);
        } else {
            products.getByCartItemId(req, res, next)
        }
    },
    products.getDataAndItems
);

module.exports = route;