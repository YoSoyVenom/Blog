const path = require("path");
const { createUser } = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = require("../config/jwt");
const { createRefreshToken } = require("../services/refreshTokenService");

function loadRegister(req, res) {
    res.sendFile(path.join(__dirname, "..", "..", "public", "views", "register.html"));
}

async function registerController(req, res) {

    const BCRYPT_ROUNDS = 12;

    try {
        const { username, email, password, bio } = req.body;

        const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

        const user_id = await createUser({
            username,
            email,
            password_hash,
            bio
        });

        // CREAR TOKENS Y COOKIES.

        const payload = {
            id: user_id
        };

        const accessToken = jwt.sign(
            payload,
            ACCESS_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        const refreshToken = jwt.sign(
            payload,
            REFRESH_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        await createRefreshToken(user_id, refreshToken);

        const cookieOptions = {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        };

        res.cookie(
            "access_token", 
            accessToken, 
            {
                ...cookieOptions,
                maxAge: 1000 * 60 * 15
            }
        );

        res.cookie(
            "refresh_token", 
            refreshToken, 
            {
                ...cookieOptions,
                maxAge: 1000 * 60 * 60 * 24 * 7
            }
        );

        return res.status(201).json({ message: "USER_CREATED_WITH_SUCCESS" });

    } catch (error) {
        if (error.code === 23505) {
            return res.status(409).json({ message: "SOME_DATA_EXISTS" });
        }

        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

module.exports = {
    loadRegister,
    registerController
}