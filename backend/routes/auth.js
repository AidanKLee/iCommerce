const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2');
const FacebookStrategy = require('passport-facebook');
const route = express.Router();
const { auth } = require('../controller/index.js');
const { parser, helper, stripe, validate } = require('../controller/middleware');
require('dotenv').config();

route.get('/', helper.isAuthenticated, auth.restoreSession, helper.getAllUserData);

route.post('/login', 
    parser.json,
    validate.string('email'),
    validate.string('password'),
    validate.email('email'),
    validate.handleErrors,
    passport.authenticate('local', {failWithError: true}),
    (req, res, next) => {
        delete req.user.password;
        next();
    }, helper.getAllUserData
);

route.get('/login/google', passport.authenticate('google', {
    scope: [
        'email', 'profile',
        'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/user.phonenumbers.read'
    ]
}));

route.get('/login/facebook', passport.authenticate('facebook', {
    scope: ['email', 'public_profile'/*, 'user_birthday'*/]
}))

route.post('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

route.post('/register',
    parser.json,
    validate.string('first_name'),
    validate.string('last_name'),
    validate.string('last_name'),
    validate.date('birth_date'),
    validate.string('email'),
    validate.string('phone'),
    validate.string('password'),
    validate.boolean('subscribed'),
    validate.email('email'),
    validate.password('password'),
    validate.handleErrors,
    auth.register
);

route.post('/register/shop',
    parser.json,
    validate.string('shop_name'),
    validate.string('description'),
    validate.string('business_email'),
    validate.string('business_phone'),
    validate.email('business_email'),
    validate.handleErrors,
    stripe.createAccount,
    auth.registerShop,
    stripe.getAccountLink
);

route.get('/stripe/account', stripe.retrieveAccount, stripe.sendAccount);

route.post('/stripe/account', stripe.retrieveAccount, stripe.getAccountLink);

passport.use(new LocalStrategy({usernameField: 'email'}, auth.login));

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT'],
    clientSecret: process.env['GOOGLE_SECRET'],
    callbackURL: `${process.env['BASE_URL']}/oauth2/google`
}, auth.google))

passport.use(new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT'],
    clientSecret: process.env['FACEBOOK_SECRET'],
    callbackURL: `${process.env['BASE_URL']}/oauth2/facebook`
}, auth.facebook))

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, email: user.email});
    });
});

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});

module.exports = route;