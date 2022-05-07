const bodyParser = require('body-parser');
// const csurf = require('csurf');
const { v4: uuid } = require('uuid');
const s = require('stripe')(process.env.STRIPE_SECRET);
const model = require('../../model');
const multer = require('multer');
const path = require('path');
const { check, validationResult } = require('express-validator');
const fs = require('fs');

const parser = {};
parser.json = bodyParser.json({limit: 100000000});
parser.urlEncoded = bodyParser.urlencoded({ extended: false });
parser.multi = multer.diskStorage({
    destination: (req, file, next) => {
        if (!req.params.productId) {
            req.params.productId = uuid();
        }
        let dir = path.join(__dirname, `../../../frontend/public/images/products/${req.params.userId}`);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir = `${dir}/${req.params.productId}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        next(null, dir);
      },
      filename: (req, file, next) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        next(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
      }
})

const helper = {};

// helper.csurf = csurf({
//     cookie: {
//         httpOnly: true,
//         sameSite: 'none',
//         secure: true
//     }
// })

helper.isAuthenticated = (req, res, next) => {
    try {
        if (req.isAuthenticated()) {
            next();
        } else {
            if (req.baseUrl === '/api/auth') {
                res.status(200).json({message: 'No user session, please login.'});
            } else {
                res.status(401).json({message: 'Not authorized.'});
            }
        }
    } catch (err) {
        next(err);
    }
}

helper.isAuthenticatedCustomer = (req, res, next) => {
    const customerId = req.params.customerId;
    const sessionUserId = req.session.passport.user.id;
    if (customerId !== sessionUserId) {
        const err = new Error();
        err.message = 'You are not authorized to access this data.'
        err.status = 403;
        return next(err);
    }
    next();
}

helper.isAuthenticatedSeller = (req, res, next) => {
    const userId = req.params.userId;
    const sessionUserId = req.session.passport.user.id;
    if (userId !== sessionUserId) {
        const err = new Error();
        err.message = 'You are not authorized to access this data.'
        err.status = 403;
        return next(err);
    }
    next();
}

helper.isCustomerCart = async (req, res, next) => {
    try {
        const customerId = req.session.passport.user.id;
        const cartId = req.params.cartId ? req.params.cartId : req.query.cart_id;
        if (cartId) {
            const cart = await model.selectCart([customerId]);
            const isCustomerCart = cart.length > 0 & cart[0].id === cartId;
            if (!isCustomerCart) {
                const err = new Error();
                err.message = 'You are not authorized to access this cart.'
                err.status = 403;
                return next(err);
            }
            req.cart = cart;
        }
        next();
    } catch (err) {
        next(err);
    }
}

helper.isSellerProduct =async  (req, res, next) => {
    try {
        const product = model.selectProductById([req.params.productId]);
        const isSellerProduct = product[0].seller_id === req.params.userId;
        if (!isSellerProduct) {
            const err = new Error();
            err.message = 'You are not authorized to edit this product.'
            err.status = 403;
            return next(err);
        }
        next();
    } catch (err) {
        next(err);
    }
}

helper.getSubCategories = async (categories) => {
    categories = await Promise.all(categories.map(async category => {
        let subCategories = await model.selectSubCategories([category.name]);
        if (subCategories && subCategories.length > 0) {
            subCategories = await helper.getSubCategories(subCategories);
        }
        return { ...category, subCategories}
    }))
    return categories;
}

helper.getAllUserData = async (req, res, next) => {
    try {
        const customer = req.user;
        let cart = await model.selectCart([customer.id]);
        if (cart.length < 1) {
            await model.insertCart([uuid(), customer.id]);
            cart = await model.selectCart([customer.id])
        }
        customer.cart = cart[0];
        customer.cart.items = await model.selectCartProducts([customer.cart.id]);
        customer.saved = await model.selectCustomerSavedProducts([customer.id]);
        const shop = await model.selectSellerById([customer.id]);
        customer.shop = shop.length > 0 ? shop[0] : {};
        if ('stripe_id' in customer.shop) {
            delete customer.shop.stripe_id;
        }
        if (!req.oauth) {
            res.status(200).json(customer);
        } else {
            res.redirect('/');
        }
        
    } catch (err) {
        next(err);
    }
}

helper.getProductsById = async (productsArray) => {
    return await Promise.all(productsArray.map(async product => {
        const categories = await model.selectProductCategories([product.id]);
        product.categories = categories.map(category => category.category_name);
        product.reviews = await model.selectProductReviews([product.id]);
        const stats = await model.selectProductStats([product.id]);
        product.stats = stats[0];
        const sale = await model.selectProductSales([product.id]);
        product.sale = sale[0];
        const seller = await model.selectSellerByProduct([product.id]);
        product.seller = seller[0];
        const sellerStats = await model.selectSellerStats([seller[0].id]);
        product.seller.stats = sellerStats[0];
        delete product.seller_id;
        const items = await model.selectItemsByProductId([product.id]);
        product.items = await Promise.all(items.map(async item => {
            const attributes = await model.selectItemAttributeValues([item.id]);
            item.attributes = {};
            attributes.forEach(attribute => item.attributes = {
                ...item.attributes,
                [attribute.attribute]: attribute.value
            });
            item.images = await model.selectItemImages([item.id])
            const sale = await model.selectItemSales([item.id]);
            item.sale = sale[0] || {};
            return item;
        }));
        return product;
    }));
}

helper.prepareSellerTransfers = async (req, res, next) => {
    try {
        let order = await model.selectPendingTransfersByOrderId([req.params.orderId]);
        order = await Promise.all(order.map(async item => {
            item.amount = Number(item.price.slice(1).replace(',','')) * Number(item.item_quantity);
            delete item.price;
            delete item.item_quantity;
            return item;
        }))
        let pendingTransfers = [];
        order.forEach(item => {
            const index = pendingTransfers.findIndex(it => it.seller_id === item.seller_id);
            if (index === -1) {
                pendingTransfers.push(item);
            } else {
                pendingTransfers[index] = {
                    ...pendingTransfers[index],
                    amount: pendingTransfers[index].amount + item.amount
                }
            }
        });
        req.order = order;
        req.pendingTransfers = pendingTransfers;
        next();
    } catch (err) {
        next(err);
    }
}

helper.getOrdersData = async (req, res, next) => {
    try {
        let years;
        let count;
        const { customerId, userId } = req.params;
        let orders = req.orders;
        if (customerId) {
            years = await model.selectCustomerOrderYears([customerId]);
            count = await model.selectCustomerOrderCount([customerId]);
            count = Number(count[0].count);
        } else {
            years = await model.selectSellerOrderYears([userId]);
            count = await model.selectSellerOrderCount([userId]);
            count =Number(count[0].count);
        }
        
        years = years.map(year => year.year);
        orders = await Promise.all(orders.map(async order => {
            if (customerId) {
                order.items = await model.selectCustomerOrderItems([order.id]);
            } else {
                order.items = await model.selectSellerOrderItems([order.id, userId]);
                if (order.items.length === 0) {
                    const err = new Error();
                    err.message = 'You are not authorized to view this order.'
                    err.status = 403;
                    throw err;
                }
            }
            const address = await model.selectAddressById([order.delivery_address_id]);
            order.delivery_address = address[0];
            delete order.delivery_address_id;
            order.items = await Promise.all(order.items.map(async item => {
                const seller = await model.selectSellerById([item.seller_id]);
                item.seller = seller[0];
                delete item.seller_id;
                const it = await model.selectItemById([item.item_id]);
                item.item = it[0];
                const image = await model.selectItemPrimaryImage([item.item.id]);
                item.item.image = image[0];
                delete item.item_id;
                return item;
            }));
            return order;
        }));
        req.orders = { orders, years, count };
        next();
    } catch (err) {
        next(err);
    }
}

helper.sendOrderData = (req, res, next) => {
    res.status(200).json(req.orders);
}

helper.submitReview = async (req, res, next) => {
    try {
        const id = uuid();
        const { customerId, userId } = req.params;
        const { order_id, customer_id, order_item_id, product_id, seller_id, rating, review } = req.body;
        if (customer_id) {
            await model.insertCustomerReview([id, userId, order_id, customer_id, rating, review]);
            await model.updateItemCustomerReviewed([true, order_item_id]);
        } else if (product_id) {
            await model.insertProductReview([id, customerId, order_id, product_id, rating, review]);
            await model.updateItemReviewed([true, order_item_id]);
        } else if (seller_id) {
            await model.insertSellerReview([id, customerId, order_id, seller_id, rating, review]);
            await model.updateItemSellerReviewed([true, order_item_id]);
        } else {
            const err = new Error();
            err.message = 'A customer_id, product_id or seller_id is required.'
            return next(err);
        }
        res.status(200).json({message: 'Your review has been submitted.'})
    } catch (err) {
        next(err);
    }
}

const stripe = {};

stripe.retrieveAccount = async (req, res, next) => {
    try {
        const seller = await model.selectSellerById([req.session.passport.user.id]);
        const account = await s.accounts.retrieve(seller[0].stripe_id);
        req.stripe = account;
        next();
    } catch(err) {
        next(err);
    }
}

stripe.createAccount = async (req, res, next) => {
    try {
        const { shop_name, description, business_email, business_phone, business_type = 'individual' } = req.body;
        const account = await s.accounts.create({
            country: 'GB',
            type: 'express',
            email: business_email,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
            business_type: business_type,
            business_profile: {
                // url: `${process.env.BASE_URL}/shop/${shop_name.replace(' ', '_')}`,
                product_description: description,
                support_phone: business_phone,
                support_email: business_email
            }
        });
        req.stripe = account;
        next();
    } catch (err) {
        next(err);
    }
}

stripe.getAccountLink = async (req, res, next) => {
    try {
        const accountLink = await s.accountLinks.create({
            account: req.stripe.id,
            refresh_url: `${process.env.BASE_URL}/my-shop?redirect=stripe`,
            return_url: `${process.env.BASE_URL}/my-shop`,
            type: 'account_onboarding'
        });
        res.status(200).json({url: accountLink.url});
    } catch (err) {
        next(err);
    }
}

stripe.sendAccount = (req, res, next) => {
    const { charges_enabled, details_submitted } = req.stripe;
    res.status(200).json({charges_enabled, details_submitted});
}

stripe.generatePaymentIntent = async (req, res, next) => {
    let { items, shipping } = req.body;
    if (shipping === 'Next Day') {
        shipping = 3.99
    } else if (shipping === 'Standard') {
        shipping = 1.99
    } else {
        shipping = 0
    }
    try {
        items = await Promise.all(items.map(async item => {
            const itemData = await model.selectItemById([item.item_id]);
            item = {...itemData[0], item_quantity: item.item_quantity};
            if (item.in_stock < item.item_quantity) {
                const itemDiff = item.item_quantity - item.in_stock;
                item.item_quantity = item.in_stock
                item.message = `Since adding this item to the cart we have sold ${itemDiff} of them. Please check the new amount is okay before proceeding with your order.`
            }
            item.total = Number(item.item_quantity) * Number(item.price.slice(1).replace(',',''));
            const primaryImage = await model.selectItemPrimaryImage([item.id]);
            item.image = primaryImage[0];
            const seller = await model.selectSellerByProduct([item.product_id]);
            item.seller = seller[0];
            return item;
        }))
        let total = shipping;
        items.forEach(item => total += item.total);
        let paymentIntent;
        const order_id = uuid();
        paymentIntent = await s.paymentIntents.create({
            amount: Math.round(total * 100),
            currency: 'gbp',
            automatic_payment_methods: {
                enabled: true,
            },
            description: JSON.stringify({order_id}),
            metadata: {
                order_id
            },
            transfer_group: order_id
        })
        req.session.passport.user.intentId = paymentIntent.id
        req.session.passport.user.prevTotal = total
        res.status(200).json({items, total, paymentIntent});
    } catch (err) {
        console.log(err)
        next(err);
    }
}

stripe.fulfillTransfersToSellers = async (req, res, next) => {
    try {
        const transferred =  await Promise.all(req.pendingTransfers.map(async transfer => {
            const stripeTransfer = await s.transfers.create({
                amount: 100 * (transfer.amount * .91),
                currency: 'gbp',
                destination: transfer.stripe_id,
                transfer_group: req.params.orderId,
            })
            return {
                ...transfer,
                transfer_id: stripeTransfer.id
            }
        }))
        await Promise.all(req.order.map(async item => {
            const transferId = transferred.filter(transfer => {
                return transfer.stripe_id === item.stripe_id;
            })[0].transfer_id;
            await model.markSellerAsPaid([transferId, item.id]);
        }))
        res.status(200).json({message: 'Transfers complete.'})
    } catch (err) {
        next(err);
    }
}

const validate = {};

validate.array = array => check(array).isArray();
validate.email = email => check(email).isEmail();
validate.password = password => check(password).isStrongPassword();
validate.stringIsValidOption = (string, options) => check(string).custom(value => {
    const match = options
        .map(option => option.toLowerCase())
        .includes(value.toLowerCase());
    if (!match) {
        const err = new Error();
        err.message = `The submitted value (${value}) should match one of the following values [${options.join(', ')}].`
        throw err;
    }
    return true;
});
validate.uuid = string => check(string).isUUID();

validate.handleErrors = (req, res, next) => {
    let err = validationResult(req);
    if (!err.isEmpty()) {
        err.message = err.errors
            .map(error => error.msg)
            .join(' ')
        err.status = 400;
        return next(err);
    }
    next();
}

module.exports = {
    parser, helper, stripe, validate
}