const express = require("express");
const refreshRouter = express.Router();
const { checkRefreshCookie } = require("../middleware/checkRefreshCookie");
const { refreshController } = require("../controllers/refreshController");
//const { refreshController } = require("../controllers/refreshController");

refreshRouter.post("/", checkRefreshCookie, refreshController);

module.exports = {
    refreshRouter
}