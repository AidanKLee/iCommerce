const express = require('express');
const route = express.Router();
const categoriesRoute = require('./categories');
const authRoute = require('./auth');
const sellerRoute = require('./seller');
const productsRoute = require('./products');

route.use('/categories', categoriesRoute);
route.use('/auth', authRoute);
route.use('/products', productsRoute);
route.use('/seller', sellerRoute)

module.exports = route;