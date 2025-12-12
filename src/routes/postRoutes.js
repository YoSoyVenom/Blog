// routes/postRoutes.js

const router = require('express').Router();
const authMiddleware = require('../middleware/auth.js'); // Importar el guardián
const postController = require('../controllers/postController.js'); // Importar el controlador

// Ruta para crear una nueva publicación
// Prefijo de la ruta asumido en app.js: /api/posts
// Ruta completa: POST /api/posts/create
router.post('/create', 
    authMiddleware, // 🔑 PRIMERO: Verifica la sesión y adjunta req.user
    postController.createPost // SEGUNDO: Ejecuta la lógica para guardar el post
); 

// Si quieres una ruta para ver el feed, también la protegerías:
// router.get('/', authMiddleware, postController.getFeed); 
router.get('/', postController.getAllPosts);

module.exports = router;