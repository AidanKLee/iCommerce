const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { products } = controller;
const multer = require('multer');
const storage = require('../controller/middleware').parser.multi;
const upload = multer({storage: storage});

route.get('/:userId/products/:category', products.get);

route.post('/:userId/products', upload.any('images'), products.create, products.createItems);

route.post('/:userId/products/:productId/items', upload.any('images'), products.createItems);

route.put('/:userId/products/:productId', upload.any('images'), products.edit);

route.delete('/:userId/products/images', products.purgeUnusedImages);

module.exports = route;