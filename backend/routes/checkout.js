const express = require('express');
const route = express.Router();
const { stripe, parser, helper, validate } = require('../controller/middleware')

route.post('/intent',
    parser.json,
    validate.array('items'),
    validate.itemIdQuantity,
    validate.stringIsValidOption('shipping', ['Next Day', 'Standard', 'Upto 7 Days']),
    validate.handleErrors,
    stripe.generatePaymentIntent
);

route.post('/transfers/:orderId',
    validate.string('orderId'),
    validate.uuid('orderId'),
    validate.handleErrors,
    helper.prepareSellerTransfers,
    stripe.fulfillTransfersToSellers
);

module.exports = route;