// Se obtiene la variable de consultas query
const pool = require("../config/db_config");

// Función que obtiene los datos del perfil de la base de datos.
async function getDataProfile(userId) {
    // Query para obtener los datos de la base de datos.
    const query = `
        SELECT username, email FROM users 
        WHERE user_id = $1;
    `;
    // Resultados de la base de datos.
    const result = await pool.query(query, [userId]);

    // Retorna las filas obtenidas de la base de datos.
    return result.rows;
}

// Función que obtiene los posts del usuario.
async function getProfilePosts(userId) {
    // Query para obtener los posts de la base de datos.
    const query = `
        SELECT 
            posts.post_id,
            posts.content_text,
            posts.created_at,
            users.username,
            posts.user_id,
            COUNT(likes.like_id) AS total_likes,
            (posts.user_id = $1) AS can_delete,
            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.post_id = posts.post_id
                AND likes.user_id = $1
            ) AS is_liked
        FROM posts
        JOIN users
            ON users.user_id = posts.user_id
        LEFT JOIN likes
            ON likes.post_id = posts.post_id
        WHERE posts.user_id = $2
        GROUP BY
            posts.post_id,
            posts.content_text,
            posts.created_at,
            users.username,
            posts.user_id
        ORDER BY posts.created_at DESC;
    `;

    // Resultado de realizar la query.
    const result = await pool.query(query, [userId, userId]);

    // Retorna los posts.
    return result.rows;
}

// Exporta las funciones del service.
module.exports = {
    getDataProfile,
    getProfilePosts
}