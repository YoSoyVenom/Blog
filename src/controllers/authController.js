const path = require("path");
// Función service que valida que el usuario exista en la base de datos.
const { findUserById } = require("../services/userService");

// Función que carga la página principal.
function loadHome(req, res) {
    // Se sirve el archivo home que es el archivo html principal.
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "home.html" ));
}

// Función que carga el nombre de usuario.
async function loadUserData(req, res) {
    // Obtiene el id de los parámetros.
    const id = req.user.id;

    // Obtiene el usuario de la base de datos.
    const user = await findUserById(id);

    if (!user) {
        // Si el usuario no existe arroja un código de estado 401.
        return res.status(401).json({message: "INVALID_CREDENTIAL"});
    }

    // Responde al Front con el nombre de usuario.
    return res.status(200).json({
        username: user.username
    });
}

// Exporta las funciones.
module.exports = {
    loadHome,
    loadUserData
}