const express = require('express');
const session = require('cookie-session');
// const cookieParser = require('cookie-parser');
const fs = require('fs');
const https = require('https');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const apiRoute = require('./backend/routes/api');
const passport = require('passport');
const { helper } = require('./backend/controller/middleware');
require('dotenv').config();

const key = fs.readFileSync('./ssl/cert.key', 'utf-8');
const cert = fs.readFileSync('./ssl/cert.pem', 'utf-8');
const passphrase = process.env['SSL_PASSPHRASE'];
const credentials = {key, cert, passphrase};

const app = express();
const PORT = process.env.PORT;

app.use(logger('dev'));

app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend/public/')));

// app.use(cookieParser());

// app.use(helper.csurf);

app.use(session({
    name: 'i-commerce-session',
    keys: [
        'b80700d7-4798-4d52-9b74-ebe010166daf',
        '88e1ca2b-e0ef-418e-9bf8-ec9d057487d4',
        '9467f23e-5da4-4bef-8f2f-4ef3909e5233'
    ],
    secret: '235645f9-00c1-4f8a-b0ba-886c4c739908',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true
    }
}));
app.use(passport.authenticate('session'));

app.use('/api', apiRoute);

app.get('/oauth2/google', passport.authenticate('google', { failWithError: true }),
    (req, res, next) => {
        delete req.user.password;
        req.oauth = true;
        next();
    }, helper.getAllUserData  
);

app.get('/oauth2/facebook', passport.authenticate('facebook', { failWithError: true }),
    (req, res, next) => {
        delete req.user.password;
        req.oauth = true;
        next();
    }, helper.getAllUserData  
);

app.get('*', (req, res, next) => {
    // res.cookie('csrf-token', req.csrfToken());
    res.sendFile(path.join(__dirname, '/frontend/public/index.html'));
});

app.use((err, req, res, next) => {
    // if (err.code === 'EBADCSRFTOKEN') {
    //     err.message = 'Form has been tampered with.'
    //     err.status = 403;
    // }
    const status = err.status || 500;
    const message = err.message;
    console.log(err);
    res.status(status).json({message});
})

const server = https.createServer(credentials, app);
server.listen(3000, () => {
    console.log(`HTTPS server listeneing on PORT: ${3000}.`);
})

// app.use(errorHandler());

app.listen(PORT || 3001, () => {
    console.log(`Server listening on PORT: ${PORT || 3001}`)
})