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
    validate.arrayOfStrings('categories'),
    validate.array('images'),
    validate.array('items'),
    validate.arrayOfImages('images'),
    validate.arrayOfItems('items'),
    validate.boolean('is_active'),
    validate.handleErrors,
    products.create,
    products.createItems
);

route.use('/:userId/products/:productId',
    validate.string('productId'),
    validate.uuid('productId'),
    validate.handleErrors,
    helper.isSellerProduct
)

route.post('/:userId/products/:productId',
    parser.json,
    validate.array('images'),
    validate.array('items'),
    validate.arrayOfImages('images'),
    validate.arrayOfItems('items'),
    validate.handleErrors,
    products.createItems
);

route.put('/:userId/products/:productId',
    parser.json,
    validate.arrayOfStrings('categories'),
    validate.array('images'),
    validate.array('items'),
    validate.arrayOfImages('images'),
    validate.arrayOfItems('items'),
    validate.boolean('is_active'),
    validate.handleErrors, 
    products.edit
);

route.get('/:userId/orders',
    validate.numberIfExists('limit'),
    validate.numberIfExists('page'),
    validate.stringIfExists('search'),
    validate.numberIfExists('year'),
    validate.handleErrors,
    seller.selectAllOrders,
    helper.getOrdersData,
    helper.sendOrderData
);

route.use('/:userId/orders/:orderId',
    validate.string('orderId'),
    validate.uuid('orderId'),
    validate.handleErrors
)

route.get('/:userId/orders/:orderId',
    customer.selectOrderById,
    helper.getOrdersData,
    helper.sendOrderData
);

route.put('/:userId/orders/:orderId',
    (req,res,next) => {
        console.log(req.query)
        next();
    },
    validate.booleanString('delivered'),
    validate.booleanString('dispatched'),
    validate.stringIfExists('order_item_id'),
    validate.UUIDIfExists('order_item_id'),
    validate.booleanString('reviewed'),
    validate.handleErrors,
    customer.selectOrderById,
    helper.getOrdersData,
    seller.updateSellerOrder
);

route.post('/:userId/review', 
    parser.json,
    validate.string('customer_id'),
    validate.string('order_id'),
    validate.string('order_item_id'),
    validate.uuid('customer_id'),
    validate.uuid('order_id'),
    validate.uuid('order_item_id'),
    validate.number('rating'),
    validate.stringIsValidOption('rating', [1,2,3,4,5]),
    validate.string('review'),
    validate.handleErrors,
    helper.submitReview
);

module.exports = route;