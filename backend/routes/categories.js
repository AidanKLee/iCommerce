const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { validate } = require('../controller/middleware/index.js');
const { categories } = controller;

route.get('/', categories.getAll);

route.get('/main', categories.getMain);

route.get('/href/:href',
    validate.string('href'),
    validate.handleErrors,
    categories.getByHref
);

route.get('/:category',
    validate.string('category'),
    validate.handleErrors,
    categories.getSub
);

route.get('/:category/attributes',
    validate.string('category'),
    validate.handleErrors,
    categories.getAttributes
);

module.exports = route;