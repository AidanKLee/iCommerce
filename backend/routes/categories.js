const express = require('express');
const route = express.Router();
const controller = require('../controller');
const { categories } = controller;

route.get('/', categories.getAll);

route.get('/main', categories.getMain);

route.get('/main/:href', categories.getByHref);

route.get('/:category', categories.getSub);

route.get('/:category/attributes', categories.getAttributes);

module.exports = route;