const express = require("express");
const { logOutController } = require("../controllers/logOutController");
const logOutRouter = express.Router();

logOutRouter.post("/", logOutController);

module.exports = {
    logOutRouter
}