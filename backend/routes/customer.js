const express = require('express');
const route = express.Router();
const controller = require('../controller/index.js');
const { customer, products } = controller;
const { helper, parser, validate } = require('../controller/middleware/index.js');

route.use('/:customerId',
    validate.string('customerId'),
    validate.uuid('customerId'),
    validate.handleErrors,
    helper.isAuthenticatedCustomer
);

route.post('/:customerId/save-item/:itemId',
    validate.string('itemId'),
    validate.booleanString('no_delete'),
    validate.uuid('itemId'),
    validate.handleErrors,
    customer.saveItem,
    products.getByItemId,
    products.getDataAndItems
);

route.use('/:customerId/cart/:cartId/:itemId',
    validate.string('cartId'),
    validate.string('itemId'),
    validate.uuid('cartId'),
    validate.uuid('itemId'),
    validate.handleErrors,
    helper.isCustomerCart,
);

route.post('/:customerId/cart/:cartId/:itemId',
    validate.booleanString('no_update'),
    validate.number('quantity'),
    validate.handleErrors,
    customer.addCartItem,
    products.getByCartItemId,
    products.getDataAndItems
);

route.put('/:customerId/cart/:cartId/:itemId',
    validate.number('quantity'),
    validate.handleErrors,
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
    validate.string('city'),
    validate.string('county'),
    validate.boolean('is_primary'),
    validate.string('line_1'),
    validate.string('line_2'),
    validate.string('postcode'),
    validate.handleErrors,
    customer.insertAddress
);

route.get('/:customerId/orders',
    validate.numberIfExists('limit'),
    validate.numberIfExists('page'),
    validate.stringIfExists('search'),
    validate.numberIfExists('year'),
    validate.handleErrors,
    customer.selectAllOrders,
    helper.getOrdersData,
    helper.sendOrderData
);

route.use('/:customerId/orders/:orderId',
    validate.string('orderId'),
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
    validate.order,
    customer.submitOrder
);

route.put('/:customerId/orders/:orderId',
    customer.confirmPayment
);

route.delete('/:customerId/orders/:orderId',
    validate.stringIfExists('order_item_id'),
    validate.string('seller_id'),
    validate.UUIDIfExists('order_item_id'),
    validate.UUIDIfExists('seller_id'),
    validate.handleErrors,
    customer.cancelOrderItems
);

route.post('/:customerId/review',
    parser.json,
    validate.oneExists,
    validate.string('order_id'),
    validate.string('order_item_id'),
    validate.stringIfExists('product_id'),
    validate.stringIfExists('seller_id'),
    validate.number('rating'),
    validate.stringIsValidOption('rating', [1,2,3,4,5]),
    validate.string('review'),
    validate.uuid('order_id'),
    validate.uuid('order_item_id'),
    validate.UUIDIfExists('product_id'),
    validate.UUIDIfExists('seller_id'),
    validate.handleErrors,
    helper.submitReview
);

module.exports = route;