const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateMiddleware } = require("../middleware/validateMiddleware");
const { createPostController, getPostsController, deletePostController } = require("../controllers/postController");
const { validatePost } = require("../schemas/schemas");
const postsRouter = express.Router();

// CREAR POST (POST)
postsRouter.post("/", requireAuth, validateMiddleware(validatePost), createPostController);

// OBTENER POSTS (GET)
postsRouter.get("/", getPostsController);

// ELIMINAR POST (DELETE)
postsRouter.delete("/", requireAuth, deletePostController);

module.exports = {
    postsRouter
}