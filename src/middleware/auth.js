const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "El email y la contraseña son campos obligatorios" });
        }

        if (!email.includes("@")) {
            res.status(422).json({ message: "Error de validación" });
        }

    } catch (error) {
        
    }
}