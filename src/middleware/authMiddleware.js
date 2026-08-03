const jwt = require("jsonwebtoken");
const { ACCESS_SECRET_KEY } = require("../config/jwt");

function requireAuth(req, res, next) {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({ message: "ACCESS_TOKEN_REQUIRED" });
    }

    try {
        const decode = jwt.verify(accessToken, ACCESS_SECRET_KEY);

        req.user = {
            id: decode.id
        };

        next();
    } catch (error) {
        return res.status(401).json({ message: "INVALID_ACCESS_TOKEN" });
    }
}

module.exports = {
    requireAuth
};