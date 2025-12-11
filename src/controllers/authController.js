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

        // 1. Buscar usuario y 2. Comparar contraseña (Tu lógica existente se mantiene)
        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Email de usuario no encontrado." });
        }
        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // 3. Crear token JWT (Incluye solo los datos esenciales para la sesión)
        const token = jwt.sign(
            {
                id: user.id,          // <--- ¡Esto es lo que necesitamos para el post!
                username: user.username,
                // email: user.email // Opcional, pero ID y username son suficientes
            },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        // 4. 🔑 CLAVE: Establecer la Cookie HTTP-Only
        // Necesitamos calcular la duración en milisegundos para maxAge
        const expiresInDuration = jwtConfig.expiresIn; // Ej: "2h"
        
        // Función auxiliar para convertir "2h" a milisegundos (simplificado para este ejemplo)
        // En un proyecto real, necesitarías una librería para esto si usas formatos como "2h" o "30d"
        const maxAgeInMs = 2 * 60 * 60 * 1000; // Asumiendo que "2h" son 2 horas

        res.cookie('jwt', token, {
            httpOnly: true,             // Previene que JavaScript en el cliente acceda al token (Seguridad XSS)
            // secure: true,             // Descomentar si usas HTTPS
            maxAge: maxAgeInMs          // El tiempo de vida de la cookie
        });

        // 5. Devolver la respuesta al cliente.
        // Ya no devolvemos el 'token' en el cuerpo JSON, solo datos del usuario y un mensaje.
        return res.status(200).json({
            message: "Inicio de sesión exitoso.",
            redirect: "/", // Sugerimos al frontend la redirección
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