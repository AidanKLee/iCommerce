const model = require('../model');
const middleware = require('./middleware');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');
const { helper } = middleware;

const auth = {};

auth.restoreSession = async (req, res, next) => {
    try {
        if (req.session.passport && req.session.passport.user && req.session.passport.user.email) {
            let customer = await model.selectCustomerByEmail(req.session.passport.user.email);
            customer = customer[0];
            delete customer.password;
            req.user = customer;
        }
        next();
    } catch (err) {
        next(err)
    }
}

auth.login = async (email, password, next) => {
    try {
        const user = await model.selectCustomerByEmail([email]);
        if (user.length === 0) {
            const err = new Error('Incorrect E-Mail.');
            err.status = 404;
            return next(err, false, {message: 'Incorrect email.'});
        }
        const match = await bcrypt.compare(password, user[0].password);
        if (!match) {
            const err = new Error('Incorrect password.');
            err.status = 400;
            return next(err, false, {message: 'Incorrect password.'});
        }
        return next(null, user[0]);
    } catch (err) {
        return next(err);
    };
};

auth.register = async (req, res, next) => {
    const { first_name, last_name, birth_date, email, phone, password, subscribed } = req.body;
    const saltRounds = 16;
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        await model.insertCustomer([uuid(), first_name, last_name, birth_date, email, phone, hash, subscribed]);
        res.status(201).json({message: 'Success'});
    } catch (err) {
        next(err);
    }
}

const categories = {};

categories.getAll = async (req, res, next) => {
    try {
        let categories = await model.selectMainCategories();
        categories = await helper.getSubCategories(categories);
        res.send(categories);
    } catch (err) {
        next(err);
    };
};

const attributes = {};



const products = {};



const user = {};



const cart = {};



module.exports = {
    auth, categories, attributes, products, user, cart
}