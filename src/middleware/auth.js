const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado." });
    }

    try {
        const decoded = jwt.verify(token, jwtConfig.secret);
        req.user = decoded; // el usuario queda disponible
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado." });
    }
};
