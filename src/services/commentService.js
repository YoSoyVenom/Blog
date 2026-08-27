const pool = require("../config/db_config");

async function getComments(userId, postId) {
    const query = `
        SELECT 
            comments.comment_id,
            comments.content,
            comments.created_at,
            comments.user_id,
            users.username,
            COUNT(comment_likes.like_id) AS total_likes,
            (comments.user_id = $1) AS can_delete,
            EXISTS (
                SELECT 1
                FROM comment_likes
                WHERE comment_likes.comment_id = comments.comment_id
                AND comment_likes.user_id = $1
            ) AS is_liked
        FROM comments
        JOIN users
            ON users.user_id = comments.user_id
        LEFT JOIN comment_likes
            ON comment_likes.comment_id = comments.comment_id
        WHERE comments.post_id = $2
        AND comments.parent_comment_id IS NULL
        GROUP BY
            comments.comment_id,
            comments.content,
            comments.created_at,
            comments.user_id,
            users.username
        ORDER BY comments.created_at DESC;
    `;

    const result = await pool.query(query, [userId, postId]);

    return result.rows;
}

async function createComment(userId, postId, content) {
    const query = `
        INSERT INTO comments (user_id, post_id, content) 
        VALUES ($1, $2, $3);
    `;

    return await pool.query(query, [userId, postId, content]);
}

module.exports = {
    getComments,
    createComment
}