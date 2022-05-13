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
        if (req.session.passport.user) {
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
        }
        next();
    } catch (err) {
        next(err);
    }
}

helper.isSellerProduct =async  (req, res, next) => {
    try {
        const product = await model.selectProductById([req.params.productId]);
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
        if (!req.error) {
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
        }
        next();
    } catch (err) {
        next(err);
    }
}

helper.sendOrderData = (req, res, next) => {
    if (!req.error) {
        return res.status(200).json(req.orders);
    }
    next();
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

helper.isUUID = string => {
    const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(string);
}

helper.variableNameToString = v => Object.keys(v)[0];

helper.isRequiredUUID = (uuid, err) => {
    const name = helper.variableNameToString(uuid);
    uuid = uuid[name]
    if (!uuid || (uuid && (typeof uuid !== 'string' || !helper.isUUID(uuid)))) {
        if (!err.message || typeof err.message === 'string') {
            err.message = [];
        }
        err.message.push(`${name} is required as a valid UUID string`);
        return false;
    }
    return true;
}

helper.isRequiredString = (string, err) => {
    const name = helper.variableNameToString(string);
    string = string[name]
    if (!string || (string && (typeof string !== 'string'))) {
        if (!err.message || typeof err.message === 'string') {
            err.message = [];
        }
        err.message.push(`${name} is required as a string`);
        return false;
    }
    return true;
}

helper.isFilledArray = (array, err) => {
    const name = helper.variableNameToString(array);
    array = array[name];
    if (!Array.isArray(array) || (Array.isArray(array) && array.length === 0)) {
        if (!err.message || typeof err.message === 'string') {
            err.message = [];
        }
        err.message.push(`${name} is required as an array with at least one item`);
        return false;
    }
    return true;
}

helper.isRequiredNumber = (number, err) => {
    const name = helper.variableNameToString(number);
    number = number[name]
    if (!number || (number && Number.isNaN(Number(number)))) {
        if (!err.message || typeof err.message === 'string') {
            err.message = [];
        }
        err.message.push(`${name} is required as a number`);
        return false;
    }
    return true;
}

helper.isArrayOfStrings = (array, err) => {
    const name = helper.variableNameToString(array);
    array = array[name];
    let areAllStrings = true;
    if (!err.message || typeof err.message === 'string') {
        err.message = [];
    }
    array.forEach(item => {
        if (typeof item !== 'string') {
            areAllStrings = false;
        }
    })
    if (!areAllStrings) {
        err.message.push(`all values in ${name} are required to be strings`)
    }
    return areAllStrings;
}

helper.areAttributeObjects = (array, err) => {
    const name = helper.variableNameToString(array);
    array = array[name];
    let areAllValid = true;
    if (!err.message || typeof err.message === 'string') {
        err.message = [];
    }
    array.forEach(item => {
        const { key, value } = item
        if (!key || !value || (key && typeof key !== 'string') || (value && typeof value !== 'string')) {
            areAllValid = false;
        }
    })
    if (!areAllValid) {
        err.message.push(`all values in ${name} are required to be objects with the attribute name as key and attribute value as value`)
    }
    return areAllValid;
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
    } else if (shipping === 'Upto 7 Days') {
        shipping = 0
    } else {
        const err = new Error();
        err.message = `The submitted value (shipping) should match one of the following values [Next Day, Standard, Upto 7 Days].`
        err.status(400);
        return next(err)
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
        next(err);
    }
}

stripe.fulfillTransfersToSellers = async (req, res, next) => {
    try {
        const transferred =  await Promise.all(req.pendingTransfers.map(async transfer => {
            const stripeTransfer = await s.transfers.create({
                amount: 100 * (Number(transfer.amount) * .91),
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

validate.array = array => check(array).isArray().withMessage(`${array} must be an array`);
validate.object = object => check(object).isObject().withMessage(`${object} must be an object`);
validate.string = string => check(string).isString().withMessage(`${string} must be a string`);
validate.number = number => check(number).isNumeric().withMessage(`${number} must be a number`);
validate.boolean = boolean => check(boolean).isBoolean().withMessage(`${boolean} must be a valid boolean (true or false)`);
validate.date = date => check(date).isDate().withMessage(`${date} must be a valid date or date string`)
validate.email = email => check(email).isEmail().withMessage(`${email} must be a email format (email@icommerce.com)`);
validate.password = password => check(password).isStrongPassword().withMessage(`passwords must be a minimum length of 8 and have a minimum on 1 lowercase, uppercase and special character`);
validate.uuid = string => check(string).isUUID().withMessage(`${string} must be a UUID format`);
validate.booleanString = string => validate.stringIsValidOption(string, ['true', 'false', undefined]);
validate.stringIfExists = string => check(string).if(check(string).exists()).isString().withMessage(`${string} must be a string`);
validate.numberIfExists = number => check(number).if(check(number).exists()).isNumeric().withMessage(`${number} must be a number`);
validate.UUIDIfExists = uuid => check(uuid).if(check(uuid).exists()).isUUID().withMessage(`${uuid} must be a string`);
validate.arrayIfExists = array => check(array).if(check(array).exists()).isArray().withMessage(`${array} must be an array`);
validate.stringIsValidOption = (string, options) => check(string).custom(value => {
    const match = options.includes(value);
    options = options.filter(option => option !== null || option !== undefined)
    if (!match) {
        const err = new Error();
        err.message = `the submitted value (${value}) should match one of the following values [${options.join(', ')}].`
        throw err;
    }
    return true;
});
validate.stringIsValidOptionIfExists = (string, options) => check(string).custom(value => {
    if (value !== undefined) {
        const match = options.includes(value);
        options = options.filter(option => option !== null || option !== undefined)
        if (!match) {
            const err = new Error();
            err.message = `the submitted value (${value}) should match one of the following values [${options.join(', ')}].`
            throw err;
        }
    }
    return true;
});
validate.oneExists = (req, res, next) => {
    const err = new Error();
    err.status = 400;
    const { product_id, seller_id } = req.body;
    const value = [ product_id, seller_id ];
    const filtered = value.filter(val => {
        return val !== undefined
    })
    if (filtered.length === 0 || filtered.length > 1) {
        err.message = `it is required that the body only contains one of the following parameters [product_id, seller_id}]`;
        throw err;
    }
    next();
}
validate.arrayOfStrings = array => check(array).custom(value => {
    const err = new Error();
    err.status = 400;
    const areAllStrings = !value.map(val => typeof val === 'string').includes(false);
    if (!areAllStrings) {
        err.message = `all values in ${array} must be strings`
        throw err;
    }
    return true;
})
validate.arrayOfUUID = array => check(array).custom(value => {
    const err = new Error();
    err.status = 400;
    const areAllStrings = !value.map(val => typeof val === 'string').includes(false);
    if (!areAllStrings) {
        err.message = `all values in ${array} must be strings`
        throw err;
    }
    const areAllUUID = !value.map(val => helper.isUUID(val)).includes(false);
    if (!areAllUUID) {
        err.message = `all values in ${array} must be UUID strings`
        throw err;
    }
    return true;
})
validate.arrayOfImages = (array) => check(array).custom(value => {
    const err = new Error();
    err.status = 400;
    err.message = [];
    if (value.length > 0) {
        value.forEach(image => {
            const { id, name, src, type } = image
            helper.isRequiredUUID({id}, err);
            helper.isRequiredString({name}, err);
            helper.isRequiredString({src}, err);
            helper.isRequiredString({type}, err);
        })
        if (err.message.length > 0)  {
            err.message = err.message.join(', ');
            throw err;
        }
    }
    return true;
})
validate.arrayOfItems = array => check(array).custom(value => {
    const err = new Error();
    err.status = 400;
    err.message = [];
    const minLength = value.length > 0;
    if (!minLength) {
        err.message.push('at least one image is required for each product')
    }
    value.forEach(item => {
        const { attributes, description, image_ids, image_id_primary, in_stock, name, price } = item;
        helper.areAttributeObjects({attributes}, err);
        helper.isRequiredString({description}, err);
        helper.isArrayOfStrings({image_ids}, err);
        helper.isRequiredUUID({image_id_primary}, err);
        helper.isRequiredNumber({in_stock}, err);
        helper.isRequiredString({name}, err);
        helper.isRequiredNumber({price}, err);
    })
    if (err.message.length > 0)  {
        err.message = err.message.join(', ');
        throw err;
    }
    return true;
})
validate.queryStringArray = array => check(array).custom(value => {
    if (value !== undefined) {
        const err = new Error();
        err.status = 400;
        if (Array.isArray(value)) {
            const areAllStrings = !value.map(val => typeof val === 'string').includes(false);
            if (!areAllStrings) {
                err.message = `if ${array} is an array all values in ${array} must be strings`
                throw err;
            }
        } else if (typeof value !== 'string') {
            err.message = `${array} must be either an array or string`
            throw err;
        }
    }
    return true;
})
validate.itemIdQuantity = (req, res, next) => {
    const { items } = req.body;
    const validsIdQuantity = !items.map(item => {
        const validId = 'item_id' in item && helper.isUUID(item.item_id);
        const validQuantity = 'item_quantity' in item && !Number.isNaN(item.item_quantity);
        return validId && validQuantity;
    }).includes(false);
    if (validsIdQuantity && items.length > 0) {
        next();
    } else {
        const err = new Error();
        err.message = 'You need at least one item with a valid UUID (item_id) and a valid number (item_quantity)';
        err.status = 400;
        throw err;
    }
}
validate.order = (req, res, next) => {
    const { cartId, deliveryAddressId, items, postage } = req.body;
    const err = new Error();
    err.message = [];
    err.status = 400;
    helper.isRequiredUUID({cartId}, err);
    helper.isRequiredUUID({deliveryAddressId}, err);
    helper.isFilledArray({items}, err);
    items.forEach(item => {
        const { item_id, item_price, item_quantity, seller_id } = item;
        helper.isRequiredUUID({item_id}, err);
        helper.isRequiredNumber({item_price}, err);
        helper.isRequiredNumber({item_quantity}, err);
        helper.isRequiredUUID({seller_id}, err);
    });
    const options = [ 'Next Day', 'Standard', 'Upto 7 Days' ];
    const { option, price } = postage;
    if (!option || (option && !options.includes(option))) {
        err.message.push(`option is required as a number`);
        return false;
    }
    helper.isRequiredNumber({price}, err);
    if (err.message.length === 0) {
        next();
    } else {
        err.message = err.message.join(', ');
        throw err;
    }
}
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