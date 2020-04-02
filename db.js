const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: process.env.DB_KEY,
    host: 'localhost',
    port:5432,
    database: "fakenewsweb",
})

module.exports = pool;