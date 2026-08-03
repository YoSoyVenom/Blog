const pool = require("../config/db_config");

//Funciones de Búsqueda.

async function findUserByEmail (email) {
    const query = `
        SELECT user_id, password_hash 
        FROM users 
        WHERE email = $1
    `;

    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) return null;

    return result.rows[0];
}

async function findUserById(id) {
    const query = `
        SELECT username, user_id FROM users 
        WHERE user_id = $1
    `;

    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;

    return result.rows[0];
}

// Funciones de Registro.

async function createUser(userData) {
    const query = `
        INSERT INTO users (username, email, password_hash, bio) 
        VALUES ($1, $2, $3, $4) 
        RETURNING user_id
    `;
    
    const result = await pool.query(query, [
        userData.username, 
        userData.email, 
        userData.password_hash, 
        userData.bio
    ]);

    return result.rows[0].user_id;
}

module.exports = {
    findUserByEmail,
    findUserById,
    createUser
}