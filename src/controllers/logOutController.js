const { deleteCurrentRefreshToken } = require("../services/refreshTokenService");

async function logOutController(req, res) {

    const cookieOptions = {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    };

    try {
        const refreshToken = req.cookies.refresh_token;

        if (refreshToken) {
            await deleteCurrentRefreshToken(refreshToken);
        }

        res.clearCookie("access_token", cookieOptions);
        res.clearCookie("refresh_token", cookieOptions);

        return res.status(200).json({
            message: "SUCCESSFUL_LOGOUT"
        });

    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        });
    }
}

module.exports = {
    logOutController
};