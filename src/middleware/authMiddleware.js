// Importa JSON Web Token.
const jwt = require("jsonwebtoken");
// Obtiene la clave de acceso.
const { ACCESS_SECRET_KEY } = require("../config/jwt");

// Función que valida la sesión.
function requireAuth(req, res, next) {
    // Obtiene el token de sesión de usuario.
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        // Si el token no existe no tiene sesión.
        return res.status(401).json({ message: "ACCESS_TOKEN_REQUIRED" });
    }

    try {
        // Verifica que el token sea válido.
        const decode = jwt.verify(accessToken, ACCESS_SECRET_KEY);

        // Devuelve el id de usuario.
        req.user = {
            id: decode.id
        };

        // Pasa a la siguiente función (el controller)
        next();

    } catch (error) {
        // Devuelve un error porque el access token no es válido.
        return res.status(401).json({ message: "INVALID_ACCESS_TOKEN" });
    }
}

// Exporta la función.
module.exports = {
    requireAuth
};