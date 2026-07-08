require("dotenv").config();
// app.js
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const { loginRouter } = require("./routes/loginRouter");
const helmet = require("helmet");

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser()); 
app.use(
    helmet({
        crossOriginResourcePolicy: false
    })
);
app.use("/css", express.static(path.join(__dirname, "..", "public", "css")));
app.use("/js", express.static(path.join(__dirname, "..", "public", "js")));
app.use("/imagenes", express.static(path.join(__dirname, "..", "public", "imagenes")));

app.use("/login", loginRouter);

module.exports = app;