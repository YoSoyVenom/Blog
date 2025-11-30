const express = require("express");
const path = require("path");
const app = express();

// PARA MANEJAR REQ.BODY
app.use(express.json());

// CARGA ARCHIVOS CSS, JS, IMÁGENES, ETC.
const RUTA_ESTATICA = path.join(__dirname, "..", "public");
app.use(express.static(RUTA_ESTATICA));

// CARGAR ARCHIVOS CON LÓGICA DE LAS RUTAS.
// CONEXIÓN CON LOS ROUTERS.
const viewRouter = require("./routes/viewRouter.js");

app.get("/", viewRouter);

module.exports = app;