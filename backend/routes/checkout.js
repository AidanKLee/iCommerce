const express = require('express');
const route = express.Router();
const { stripe, parser, helper } = require('../controller/middleware')

route.post('/intent', parser.json, stripe.generatePaymentIntent);

route.post('/transfers/:orderId', helper.prepareSellerTransfers, stripe.fulfillTransfersToSellers);

// const retrievePaymentIntent = async () => await stripe.paymentIntents.retrieve('client_secret')

module.exports = route;