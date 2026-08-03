const jwt = require("jsonwebtoken");
const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = require("../config/jwt");
const { findUserById } = require("../services/userService");
const { deleteCurrentRefreshToken, createRefreshToken, findRefreshToken } = require("../services/refreshTokenService");

async function refreshController(req, res) {
    const oldRefreshToken = req.cookies.refresh_token;

    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    };

    try {

        const storedToken = await findRefreshToken(oldRefreshToken);

        if (!storedToken) {
            res.clearCookie("access_token", cookieOptions);
            res.clearCookie("refresh_token", cookieOptions);

            return res.status(401).json({ message: "SESSION_EXPIRED" });
        }

        const decoded = jwt.verify(oldRefreshToken, REFRESH_SECRET_KEY);

        const user = await findUserById(decoded.id);

        if (!user) {

            res.clearCookie("access_token", cookieOptions);
            res.clearCookie("refresh_token", cookieOptions);

            return res.status(401).json({ message: "INVALID_CREDENTIALS" });
        }

        const deleted = await deleteCurrentRefreshToken(oldRefreshToken);

        if (deleted === 0) {

            res.clearCookie("access_token", cookieOptions);
            res.clearCookie("refresh_token", cookieOptions);

            return res.status(401).json({ message: "SESSION_EXPIRED" });
        }

        const payload = {
            id: user.user_id
        };

        const accessToken = jwt.sign(
            payload,
            ACCESS_SECRET_KEY,
            {
                expiresIn: "15m"
            }
        );

        const newRefreshToken = jwt.sign(
            payload,
            REFRESH_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        );

        await createRefreshToken(user.user_id, newRefreshToken);

        res.cookie("access_token", accessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15
        });

        res.cookie("refresh_token", newRefreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.status(200).json({ message: "ACCESS_TOKEN_REFRESHED" });

    } catch (error) {
        if (
            error.name === "TokenExpiredError" ||
            error.name === "JsonWebTokenError"
        ) {
            await deleteCurrentRefreshToken(oldRefreshToken);
        
            res.clearCookie("access_token", cookieOptions);
            res.clearCookie("refresh_token", cookieOptions);
        
            return res.status(401).json({
                message: "SESSION_EXPIRED"
            });
        }
        return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
    }
}

module.exports = {
    refreshController
}