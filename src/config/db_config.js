const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    port: 5432,
    password: "root2026",
    database: "db_blog"
});

module.exports = pool;