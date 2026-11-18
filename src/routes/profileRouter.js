// Importación de modulos y funciones necesarias.
const express = require("express");
// Importación de archivos Controller.
const { loadProfile, loadDataProfile, loadPostsProfile } = require("../controllers/profileController");
// Importación middleware de validación.
const { requireAuth } = require("../middleware/authMiddleware");
// Creación del router.
const profileRouter = express.Router();

// Ruta que sirve la página.
profileRouter.get("/", loadProfile);
// Ruta que carga los datos de la página profile.
profileRouter.post("/me", requireAuth, loadDataProfile);
// Ruta que carga los posts de la página profile.
profileRouter.post("/posts", requireAuth, loadPostsProfile);

// Exportación de router.
module.exports = {
    profileRouter
}