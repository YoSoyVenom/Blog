const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { validateMiddleware } = require("../middleware/validateMiddleware");
const { createPostController, getPostsController, deletePostController, toggleLikeController, sharePostController } = require("../controllers/postController");
const { validatePost } = require("../schemas/schemas");
const postsRouter = express.Router();

// CREAR POST (POST)
postsRouter.post("/", requireAuth, validateMiddleware(validatePost), createPostController);

// OBTENER POSTS (GET)
postsRouter.get("/", requireAuth, getPostsController);

// ELIMINAR POST (DELETE)
postsRouter.delete("/", requireAuth, deletePostController);

// DAR LIKE (POST)
postsRouter.post("/:post_id/like", requireAuth, toggleLikeController);

// OBTENER POST (POST)
postsRouter.post("/:post_id/share", sharePostController)

module.exports = {
    postsRouter
}