const express = require("express");
const router = express.Router();

const postController = require("../controllers/post");
const { verify } = require("../auth");

// Create Post
router.post("/addPost", verify, postController.addPost);

// Get All Posts
router.get("/getAllPosts", postController.getAllPosts);

// Get One Post
router.get("/getPost/:id", postController.getPost);

// Add Comment
router.post("/addComment/:id", verify, postController.addComment);

// Update Post
router.put("/updatePost/:id", verify, postController.updatePost);

// Delete Post
router.delete("/deletePost/:id", verify, postController.deletePost);

module.exports = router;