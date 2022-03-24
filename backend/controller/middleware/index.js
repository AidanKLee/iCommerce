const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const model = require('../../model');

const parser = {};
parser.json = bodyParser.json();
parser.urlEncoded = bodyParser.urlencoded({ extended: false });

const helper = {};
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
        if (req.user) {
            const customer = req.user;
            let cart = await model.selectCart([customer.id]);
            if (cart.length < 1) {
                await model.insertCart([uuid(), customer.id]);
                cart = await model.selectCart([customer.id])
            }
            cart[0].items = await model.selectCartItems([cart.id]);
            customer.cart = cart[0]
            customer.saved = await model.selectCustomerSavedItems([customer.id]);
            const shop = await model.selectSellerById([customer.id]);
            customer.shop = shop.length > 0 ? shop[0] : {};
            return res.status(200).send(customer);
        }
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = {
    parser, helper
}