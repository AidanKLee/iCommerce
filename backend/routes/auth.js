const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const route = express.Router();
const { auth } = require('../controller');
const { parser, helper } = require('../controller/middleware');

route.get('/', auth.restoreSession, helper.getAllUserData);

route.post('/login', parser.json, passport.authenticate('local'),
    (req, res, next) => {
        delete req.user.password;
        next();
    }, helper.getAllUserData        
);

route.post('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

route.post('/register', parser.json, auth.register);

passport.use(new LocalStrategy({usernameField: 'email'}, auth.login));

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