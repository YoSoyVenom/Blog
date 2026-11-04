// Se obtiene la variable de consultas query
const pool = require("../config/db_config");

// Función que obtiene los datos del perfil de la base de datos.
async function getDataProfile(userId) {
    // Query para obtener los datos de la base de datos.
    const query = `
        SELECT 
            users.username,
            users.email,
            posts.post_id,
            posts.content_text,
            COUNT(likes.like_id) AS total_likes,
            EXISTS (
                SELECT 1
                FROM likes
                WHERE likes.post_id = posts.post_id
                    AND likes.user_id = $1
            ) AS is_liked
        FROM users
        JOIN posts 
            ON users.user_id = posts.user_id
        LEFT JOIN likes 
            ON likes.post_id = posts.post_id
        WHERE users.user_id = $1
        GROUP BY
            users.user_id,
            users.username,
            users.email,
            posts.post_id,
            posts.content_text
        ORDER BY posts.created_at DESC;
    `;

    // Resultados de la base de datos.
    const result = await pool.query(query, [userId]);

    // Retorna las filas obtenidas de la base de datos.
    return result.rows;
}

// Exporta las funciones del service.
module.exports = {
    getDataProfile
}