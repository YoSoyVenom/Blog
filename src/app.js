require("dotenv").config();
// app.js
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const { loginRouter } = require("./routes/loginRouter");
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

app.use("/login", loginRouter);

module.exports = app;