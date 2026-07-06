const app = require("./app");
const PORT = process.env.PORT || 3200;
const pool = require("./config/db_config");
const helmet = require("helmet");

app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);

app.listen(PORT, () => {
    console.log(`Servidor escuchando en ${PORT}`);
});