const app = require("./app");
const PORT = process.env.PORT || 3200;
require("./cron-jobs/refreshCleanup");

app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});