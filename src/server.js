const app = require("./app");
const PORT = process.env.PORT || 3200;
require("./cron-jobs/refreshCleanup");

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en ${PORT}`);
});