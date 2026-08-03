require("dotenv").config();
// app.js
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const { loginRouter } = require("./routes/loginRouter");
const { registerRouter } = require("./routes/registerRouter");
const { homeRouter } = require("./routes/homeRouter");
const { refreshRouter } = require("./routes/refreshRouter")

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

// LOGIN
app.use("/login", loginRouter);

// REGISTER
app.use("/register", registerRouter);

// HOME
app.use("/home", homeRouter);

// REFRESH TOKEN
app.use("/refresh", refreshRouter);

module.exports = app;