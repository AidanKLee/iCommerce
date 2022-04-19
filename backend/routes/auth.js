const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth2');
const FacebookStrategy = require('passport-facebook');
const route = express.Router();
const { auth } = require('../controller/index.js');
const { parser, helper } = require('../controller/middleware');
require('dotenv').config();

route.get('/', helper.isAuthenticated, auth.restoreSession, helper.getAllUserData);

route.post('/login', parser.json, passport.authenticate('local', {failWithError: true}),
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

route.post('/register', parser.json, auth.register);

route.post('/registerShop', parser.json, auth.registerShop, helper.getAllUserData);

passport.use(new LocalStrategy({usernameField: 'email'}, auth.login));

console.log(`${process.env['BASE_URL']}/oauth2/google`)

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