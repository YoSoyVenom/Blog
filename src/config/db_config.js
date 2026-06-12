const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "db_blog",
    password: "root2026",
    port: 5432
});

module.exports = pool;