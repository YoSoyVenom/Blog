// Importación del módulo path.
const path = require("path");

// Función sirve el perfil.
function loadProfile(req, res) {
    // Sirve el archivo de perfil.
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "profile.html" ));
}

// Exportación de las funciones.
module.exports = {
    loadProfile
}