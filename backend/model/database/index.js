const pgp = require('pg-promise')();
require('dotenv').config();
const { PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

let ssl = null;
if (process.env.NODE_ENV === 'dev') {
   ssl = {
       rejectUnauthorized: false,
       require: true
    };
}

const connect = {
    connectionString: `postgres://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`,
    max: 20,
    ssl: ssl
};

const db = pgp(connect);

module.exports = db;