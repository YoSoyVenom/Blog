const pool = require("../config/db_config");

function createPost(user_id, content) {
    const query = `
        INSERT INTO posts (user_id, content_text)
        VALUES ($1, $2)
    `;

    return pool.query(query, [user_id, content]);
}

async function getPosts(userId) {
    const query = `
        SELECT 
            posts.post_id,
            posts.content_text,
            posts.created_at,
            users.username,
            posts.user_id,
            COUNT(likes.like_id) AS total_likes,
            CASE 
                WHEN posts.user_id = $1 THEN true
                ELSE false
            END AS can_delete,
            EXISTS (
                SELECT 1 
                FROM likes 
                WHERE likes.post_id = posts.post_id AND likes.user_id = $1
            ) AS is_liked
        FROM posts
        JOIN users ON users.user_id = posts.user_id
        LEFT JOIN likes ON likes.post_id = posts.post_id
        GROUP BY 
            posts.post_id,
            posts.content_text,
            posts.created_at,
            users.username,
            posts.user_id
        ORDER BY posts.created_at DESC;
    `;

    const result = await pool.query(query, [userId]);

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

async function getContentPost(postId) {
    const query = `
        SELECT content_text FROM posts
        WHERE post_id = $1
    `;

    const result = await pool.query(query, [postId]);

    return result.rows[0].content_text;
}

module.exports = {
    createPost,
    getPosts,
    deletePost,
    getContentPost
}