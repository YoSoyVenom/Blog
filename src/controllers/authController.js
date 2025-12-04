const userModel = require("../models/userModels");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

// ====================== REGISTRO ======================
exports.register = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // 1. Verificar si ya existe un usuario con ese email
        const user = await userModel.findUserByEmail(email);
        if (user) {
            return res.status(400).json({ message: "Este email ya está registrado." });
        }

        // 2. Verificar username repetido
        const allUsers = await userModel.getAllUsers();
        const usernameExists = allUsers.find(u => u.username === username);
        if (usernameExists) {
            return res.status(400).json({ message: "Este nombre de usuario ya existe." });
        }

        // 3. Crear hash
        const hash = await bcrypt.hash(password, 10);

        // 4. Crear usuario
        const newUser = {
            id: crypto.randomUUID(),
            username,
            email,
            password_hash: hash,
            profile_picture: null,
            bio: "",
            created_at: new Date().toISOString()
        };

        await userModel.createUser(newUser);

        return res.json({ message: "Usuario creado con éxito." });

    } catch (error) {
        console.error("Error en register", error);
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};


// ====================== LOGIN ======================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar usuario
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Email de usuario no encontrado." });
        }

        // 2. Comparar contraseña
        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // 3. Crear token JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return res.json({
            message: "Inicio de sesión exitoso.",
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Error en login", error);
        res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
