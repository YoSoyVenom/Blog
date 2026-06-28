const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    password: process.env.DB_PASSWORD,
    database: "db_blog"
});

module.exports = pool;