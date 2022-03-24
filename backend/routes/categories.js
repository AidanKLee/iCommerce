const express = require('express');
const route = express.Router();
const controller = require('../controller');
const { categories } = controller;

route.get('/', (req, res, next) => {
    categories.getAll(req, res, next)
});

module.exports = route;