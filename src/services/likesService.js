const pool = require("../config/db_config");

async function findLike(userId, postId) {
    const query = `
        SELECT like_id FROM likes
        WHERE user_id = $1 AND post_id = $2
    `;

    const result = await pool.query(query, [userId, postId]);

    return result.rowCount > 0;
}

async function createLike(userId, postId) {
    const query = `
        INSERT INTO likes (user_id, post_id)
        VALUES ($1, $2)
    `;
    
    const result = await pool.query(query, [userId, postId]);

    return result.rowCount > 0;
}

async function deleteLike(userId, postId) {
    const query = `
        DELETE FROM likes 
        WHERE user_id = $1 AND post_id = $2
    `;

    const result = await pool.query(query, [userId, postId]);

    return result.rowCount > 0;
}

module.exports = {
    findLike,
    createLike,
    deleteLike
}