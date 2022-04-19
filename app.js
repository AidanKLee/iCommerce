const express = require('express');
const session = require('express-session');
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

app.use(session({
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false,
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
    res.sendFile(path.join(__dirname, '/frontend/public/index.html'));
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message;
    console.log(err)
    res.status(status).json({message});
})

const server = https.createServer(credentials, app);

server.listen(PORT, () => {
    console.log(`HTTPS server listeneing on PORT: ${PORT}.`);
})

// app.use(errorHandler());

// app.listen(PORT, () => {
//     console.log(`Server listening on PORT: ${PORT}`)
// })