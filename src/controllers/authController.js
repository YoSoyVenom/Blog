const userModel = require("../models/userModels");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// REGISTRO.

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    const user = userModel.findUserByEmail(email);
    if (user) {
        res.status(400).json({ message: "Este email ya está registrado." });
    }
    if (user.username === username) {
        res.status(400).json({ message: "Este nombre de usuario ya existe" })
    }
    const newUser = {
        id: crypto.randomUUID(),
        username: username,
        email: email,
        password_hash: bcrypt.hashSync(password),
        profile_picture: null,
        bio: "",
        created_at: ""
    }
    userModel.createUser(newUser);
    res.json({ message: "Usuario creado con exito." });
}

// INICIO DE SESION.
exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = userModel.findUserByEmail(email);

    if (!user) {
        res.status(404).json({message: "Email de usuario no encontrado..."});
    }
    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) {
        res.status(401).json({message: "Contraseña incorrecta"});
    }

    res.json({
        message: "Inicio de sesión exitoso",
    });
};