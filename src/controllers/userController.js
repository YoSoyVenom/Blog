const { findUserByEmail } = require("../services/userService");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = require("../config/jwt");

async function userController(req, res) {

    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generar JWT
        const payload = { id: user.user_id };

        const accessToken = JWT.sign(
            payload, 
            ACCESS_SECRET_KEY,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = JWT.sign(
            payload, 
            REFRESH_SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 15,
            secure: process.env.NODE_ENV === "production"
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production"
        });

        return res.status(200).json({ message: "Inicio de sesión exitoso" });

    } catch (error) {

        res.status(500).json({ message: "Error interno del servidor" });

    }
};