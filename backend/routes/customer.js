const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { customer, products } = controller;
const { helper, parser, validate } = require('../controller/middleware/index.js');

route.use('/:customerId',
    validate.uuid('customerId'),
    validate.handleErrors,
    helper.isAuthenticatedCustomer
);

route.post('/:customerId/save-item/:itemId',
    validate.uuid('itemId'),
    validate.handleErrors,
    customer.saveItem,
    products.getByItemId,
    products.getDataAndItems
);

route.use('/:customerId/cart/:cartId/:itemId',
    validate.uuid('cartId'),
    validate.uuid('itemId'),
    validate.handleErrors,
    helper.isCustomerCart,
);

route.post('/:customerId/cart/:cartId/:itemId',
    customer.addCartItem,
    products.getByCartItemId,
    products.getDataAndItems
);

route.put('/:customerId/cart/:cartId/:itemId',
    customer.updateCartItem,
    products.getByCartItemId,
    products.getDataAndItems
);

route.delete('/:customerId/cart/:cartId/:itemId',
    customer.deleteCartItem
);

route.get('/:customerId/addresses',
    customer.selectAddresses
);

route.post('/:customerId/addresses',
    parser.json,
    customer.insertAddress
);

route.get('/:customerId/orders',
    customer.selectAllOrders,
    helper.getOrdersData,
    helper.sendOrderData
);

route.use('/:customerId/orders/:orderId',
    validate.uuid('orderId'),
    validate.handleErrors
)

route.get('/:customerId/orders/:orderId',
    customer.selectOrderById,
    helper.getOrdersData,
    helper.sendOrderData
);

route.post('/:customerId/orders/:orderId',
    parser.json,
    customer.submitOrder
);

route.put('/:customerId/orders/:orderId',
    customer.confirmPayment
);

route.delete('/:customerId/orders/:orderId',
    customer.cancelOrderItems
);

route.post('/:customerId/review',
    parser.json,
    helper.submitReview
);

module.exports = route;