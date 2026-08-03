const cron = require("node-cron");
const { deleteExpiredRefreshTokens } = require("../services/refreshTokenService");

cron.schedule("0 * * * *", async () => {
    try {
        await deleteExpiredRefreshTokens();
    } catch (error) {
        console.error("Error limpiando refresh tokens:", error);
    }
});