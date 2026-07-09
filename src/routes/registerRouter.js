const express = require("express");
const registerRouter = express.Router();
const { validateDataRegister } = require("../schemas/schemas");
const { validateMiddleware } = require("../middleware/validateMiddleware");
const { loadRegister, registerController } = require("../controllers/registerController");

registerRouter.get("/", loadRegister);
registerRouter.post("/", validateMiddleware(validateDataRegister), registerController);

module.exports = {
    registerRouter
};