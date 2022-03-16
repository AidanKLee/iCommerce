const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');
const apiRoute = require('./backend/routes/api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend/public/')));

app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'frontend/public/index.html'));
})

app.get('/api', apiRoute);

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`)
})