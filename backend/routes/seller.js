const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { customer, products, seller } = controller;
const { helper, parser, validate } = require('../controller/middleware');

route.get('/:userId/products/:category',
    products.get
);

route.delete('/:userId/products/images',
    products.purgeUnusedImages
);

route.use('/:userId',
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