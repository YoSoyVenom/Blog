require("dotenv").config;
// app.js
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser"); // Ya lo tienes importado, ¡bien!

// PARA MANEJAR req.body
app.use(express.json());

// 💡 Nuevo: Middleware para leer y escribir cookies
app.use(cookieParser()); 

const userRouter = require("./routes/userRouter");
app.get("/", userRouter);

module.exports = app;