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

// Exporta las funciones del service.
module.exports = {
    getDataProfile
}