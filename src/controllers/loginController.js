const path = require("path");
const { findUserByEmail } = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = require("../config/jwt");

function loadLogin(req, res) {
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "login.html"));
}

async function loginController(req, res) {

    try {
        
        const { email, password } = req.body;

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: "INVALID_CREDENTIALS" });
        }

        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ message: "INVALID_CREDENTIALS" });
        }

        // Generar JWT
        const payload = { id: user.user_id };

        const accessToken = jwt.sign(
            payload, 
            ACCESS_SECRET_KEY,
            {
                expiresIn: "15m",
            }
        );

        const refreshToken = jwt.sign(
            payload, 
            REFRESH_SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        const cookieOptions = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        };

        res.cookie("access_token", accessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15
        });

        // DESPUES EL REFRESH TOKEN DEBE GUARDARSE EN LA BASE DE DATOS.

        res.cookie("refresh_token", refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).json({ message: "SUCCESSFUL_LOGIN" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });

    }
};

module.exports = {
    loadLogin,
    loginController
};