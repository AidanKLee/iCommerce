const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { customer, products, seller } = controller;
const { helper, parser, validate } = require('../controller/middleware');

route.get('/:userId/products/:category',
    validate.string('userId'),
    validate.uuid('userId'),
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

route.delete('/:userId/products/images',
    validate.string('userId'),
    validate.uuid('userId'),
    validate.handleErrors,
    products.purgeUnusedImages
);

route.use('/:userId',
    validate.string('userId'),
    validate.uuid('userId'),
    validate.handleErrors,
    helper.isAuthenticatedSeller
);

route.post('/:userId/products',
    parser.json,
    products.create,
    products.createItems
);

route.use('/:userId/products/:productId',
    validate.uuid('productId'),
    validate.handleErrors,
    helper.isSellerProduct
)

route.post('/:userId/products/:productId',
    parser.json,
    products.createItems
);

route.put('/:userId/products/:productId',
    parser.json, 
    products.edit
);

route.get('/:userId/orders',
    seller.selectAllOrders,
    helper.getOrdersData,
    helper.sendOrderData
);

route.use('/:userId/orders/:orderId',
    validate.uuid('orderId'),
    validate.handleErrors
)

route.get('/:userId/orders/:orderId',
    customer.selectOrderById,
    helper.getOrdersData,
    helper.sendOrderData
);

route.put('/:userId/orders/:orderId',
    customer.selectOrderById,
    helper.getOrdersData,
    seller.updateSellerOrder
);

route.post('/:userId/review', 
    parser.json,
    helper.submitReview
);

module.exports = route;