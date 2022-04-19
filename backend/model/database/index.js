const pgp = require('pg-promise')();
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '/../../../.env')});

let connect;
const development = process.env.NODE_ENV === 'development';
let connectionString = process.env.DATABASE_URL;

// const config = {
//     host: process.env['PG_HOST'],
//     port: process.env['PG_PORT'],
//     database: process.env['PG_DATABASE'],
//     user: process.env['PG_USERNAME'],
//     password: process.env['PG_PASSWORD']
// }

if (development) {
    connect = connectionString;
} else {
    connect = {
        connectionString,
        max: 20,
        ssl: {
            rejectUnauthorized: false,
            require: true
        }
    }
}

const db = pgp(connect);

module.exports = db;