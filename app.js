const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const errorHandler = require('errorhandler');
const apiRoute = require('./backend/routes/api');
const passport = require('passport');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

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

app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
})

app.use((err, req, res, next) => {
    const status = err.status;
    const message = err.message;
    res.statusMessage = message;
    res.status(status).json({status, message});
})

app.use(errorHandler());

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`)
})