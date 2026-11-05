// Importación del módulo path.
const path = require("path");
const { getDataProfile } = require("../services/profileService");

// Función sirve el perfil.
function loadProfile(req, res) {
    // Sirve el archivo de perfil.
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "profile.html" ));
}

// Función que obtiene los datos de perfil.
async function loadDataProfile(req, res) {
    try {
        // ID del usuario.
        const userId = req.user.id;

        // Obtener los datos de perfil.
        const datosDeUsuario = await getDataProfile(userId);
        console

        // Devuelve los datos de perfil.
        return res.status(200).json(datosDeUsuario);

    } catch (error) {
        // Manejo de error.
        return res.status(500).json(error.message);
    }
}

// Exportación de las funciones.
module.exports = {
    loadProfile,
    loadDataProfile
}


// Lo mejor será hacer peticiones individuales