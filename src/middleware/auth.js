// middleware/auth.js

const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
    // 1. 🔑 CLAVE: Intentar obtener el token de la cookie 'jwt'
    const token = req.cookies.jwt; 
    
    // Si no tienes el token en la cookie, podrías intentar leer el header
    // if (!token) {
    //     token = req.headers.authorization?.split(" ")[1]; // Mantenemos esta línea si quieres dualidad
    // }

    if (!token) {
        // No hay token en la cookie (o header, si lo mantienes)
        return res.status(401).json({ message: "No autorizado. Inicie sesión para continuar." });
    }

    try {
        // 2. Verificar y decodificar el token
        const decoded = jwt.verify(token, jwtConfig.secret);
        
        // 3. Adjuntar la información del usuario
        req.user = decoded; // { id: '...', username: '...' }
        next();
        
    } catch (error) {
        // Si el token es inválido o ha expirado (ej. 403 Forbidden)
        
        // 4. Limpiar la cookie (Buena práctica para tokens expirados/inválidos)
        res.clearCookie('jwt'); 
        
        return res.status(403).json({ message: "Sesión expirada o token inválido." });
    }
};