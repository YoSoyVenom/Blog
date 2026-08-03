const pool = require("../config/db_config");

async function createRefreshToken(user_id, refresh_token) {
    const QUERY = `
        INSERT INTO refresh_tokens (user_id, refresh_token)
        VALUES ($1, $2)
        RETURNING refresh_token_id;
    `;

    const result = await pool.query(QUERY, [user_id, refresh_token]);

    return result.rows[0].refresh_token_id;
}

async function deleteCurrentRefreshToken(refresh_token) {
    const query = `
        DELETE FROM refresh_tokens
        WHERE refresh_token = $1
    `;

    const result = await pool.query(query, [refresh_token]);

    return result.rowCount;
}

async function deleteExpiredRefreshTokens() {
    const query = `
        DELETE FROM refresh_tokens
        WHERE expires_at < NOW()
    `
    await pool.query(query);
}

async function findRefreshToken(refresh_token) {
    const query = `
        SELECT refresh_token FROM refresh_tokens
        WHERE refresh_token = $1
    `;

    const result = await pool.query(query, [refresh_token]);

    if (result.rows.length === 0) return null;

    return result.rows[0];
}

module.exports = {
    createRefreshToken,
    deleteCurrentRefreshToken,
    deleteExpiredRefreshTokens,
    findRefreshToken
}