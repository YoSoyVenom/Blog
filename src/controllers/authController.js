const userModel = require("../models/userModels");
const crypto = require("crypto");

// INICIO DE SESION.
exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = userModel.findUserByEmail(email);

    if (!user) {
        res.status(404).json({message: "Email de usuario no encontrado..."});
    }
    if (user.password_hash !== password) {
        res.status(401).json({message: "Contraseña incorrecta"});
    }

    res.json({
        message: "Inicio de sesión exitoso",
        user: {
            id: user.id,
            email: user.email,
            password: user.password
        }
    });
};