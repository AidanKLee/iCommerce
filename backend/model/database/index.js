const pgp = require('pg-promise')();
require('dotenv').config();
const { PG_USERNAME, PG_PASSWORD, PG_HOST, PG_PORT, PG_DATABASE } = process.env;

const connect = `postgres://${PG_USERNAME}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`;

const db = pgp(connect);

module.exports = db;