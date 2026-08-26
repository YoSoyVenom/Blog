const pool = require("../config/db_config");

async function findCommentLike(userId, commentId) {
    const query = `
        SELECT like_id FROM comment_likes 
        WHERE user_id = $1 AND comment_id = $2;
    `;

    const result = await pool.query(query, [userId, commentId]);

    return result.rowCount > 0;
}

async function createCommentLike(userId, commentId) {
    const query = `
        INSERT INTO comment_likes (user_id, comment_id) VALUES ($1, $2);
    `;

    const result = await pool.query(query, [userId, commentId]);

    return result.rowCount > 0;
}

async function deleteCommentLike(userId, commentId) {
    const query = `
        DELETE FROM comment_likes 
        WHERE user_id = $1 AND comment_id = $2;
    `;

    const result = await pool.query(query, [userId, commentId]);

    return result.rowCount > 0;
}

module.exports = {
    findCommentLike,
    createCommentLike,
    deleteCommentLike
}