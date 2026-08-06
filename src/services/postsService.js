const pool = require("../config/db_config");

function createPost(user_id, content) {
    const query = `
        INSERT INTO posts (user_id, content_text)
        VALUES ($1, $2)
    `;

    return pool.query(query, [user_id, content]);
}

module.exports = {
    createPost
}