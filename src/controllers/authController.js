const userModel = require("../models/userModels");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// INICIO DE SESION.
exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = userModel.findUserByEmail(email);

    if (!user) {
        res.status(404).json({message: "Email de usuario no encontrado..."});
    }
    const hashedPassword = bcrypt.compareSync(password, user.password);
    if (!hashedPassword) {
        res.status(401).json({message: "Contraseña incorrecta"});
    }

    res.json({
        message: "Inicio de sesión exitoso",
    });
};