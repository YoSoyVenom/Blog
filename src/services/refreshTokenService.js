const pool = require("../config/db_config");

async function createRefreshToken(user_id, refresh_token) {
    const QUERY = `
        INSERT INTO refresh_tokens (user_id, refresh_token)
        VALUES ($1, $2)
        RETURNING refresh_token_id;
    `;

    const resultado = await pool.query(QUERY, [user_id, refresh_token]);

    return resultado.rows[0].refresh_token_id;
}

module.exports = {
    createRefreshToken
}