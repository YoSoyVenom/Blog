const express = require("express");
const path = require("path");
const app = express();

// PARA MANEJAR REQ.BODY
app.use(express.json());

// CARGA ARCHIVOS CSS, JS, IMÁGENES, ETC.
const RUTA_ESTATICA = path.join(__dirname, "..", "public");
app.use(express.static(RUTA_ESTATICA));

// CARGAR ARCHIVOS CON LÓGICA DE LAS RUTAS.
const viewRouter = require("./routes/viewRouter.js");

// CONEXIÓN CON LOS ROUTERS.
app.use("/", viewRouter);

module.exports = app;