const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

/**
 * Create a connection pool for database connection
 */
const pool = mysql.createPool({
    connectionLimit: 50,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
});

module.exports = pool;