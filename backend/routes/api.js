const express = require('express');
const route = express.Router();
const categoriesRoute = require('./categories');
const authRoute = require('./auth');

route.use('/categories', categoriesRoute);
route.use('/auth', authRoute);

module.exports = route;