const pgp = require('pg-promise')();
require('dotenv').config();
const { PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

let ssl = {
       rejectUnauthorized: false,
       require: true
    };

const connectionString = process.env['DATABASE_URL'];

const config = {
    host: process.env['PG_HOST'],
    port: process.env['PG_PORT'],
    database: process.env['PG_DATABASE'],
    user: process.env['PG_USERNAME'],
    password: process.env['PG_PASSWORD']
}

const connect = {
    connectionString,
    max: 20,
    ssl: ssl
};

const db = pgp(connect);

module.exports = db;