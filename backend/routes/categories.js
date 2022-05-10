const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { categories } = controller;

route.get('/', categories.getAll);

route.get('/:href', categories.getByHref);

route.get('/main', categories.getMain);

route.get('/:category', categories.getSub);

route.get('/:category/attributes', categories.getAttributes);

module.exports = route;