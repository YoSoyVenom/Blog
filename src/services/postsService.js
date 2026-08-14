const pool = require("../config/db_config");

function createPost(user_id, content) {
    const query = `
        INSERT INTO posts (user_id, content_text)
        VALUES ($1, $2)
    `;

    return pool.query(query, [user_id, content]);
}

async function getPosts() {
    const query = `
        SELECT
            posts.post_id,
            posts.content_text,
            posts.created_at,
            users.username,
            users.user_id
        FROM posts
        JOIN users
        ON posts.user_id = users.user_id
        ORDER BY posts.created_at DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
}

async function deletePost(user_id, post_id) {
    const query = `
        DELETE FROM posts
        WHERE user_id = $1 AND post_id = $2
    `;

    const result = await pool.query(query, [user_id, post_id]);

    return result.rowCount;
}

module.exports = {
    createPost,
    getPosts,
    deletePost
}