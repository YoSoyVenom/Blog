function checkRefreshCookie(req, res, next) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json({ message: "SESSION_EXPIRED" });
    }

    next();
}

module.exports = {
    checkRefreshCookie
}