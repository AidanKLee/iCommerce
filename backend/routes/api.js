const express = require('express');
const route = express.Router();
const categoriesRoute = require('./categories');
const customerRoute = require('./customer');
const authRoute = require('./auth');
const sellerRoute = require('./seller');
const productsRoute = require('./products');

route.use('/auth', authRoute);
route.use('/categories', categoriesRoute);
route.use('/customer', customerRoute);
route.use('/products', productsRoute);
route.use('/seller', sellerRoute)

module.exports = route;