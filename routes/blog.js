const express = require("express");
const { body } = require("express-validator");

const blogController = require("../controllers/blog");

const router = express.Router();

// [POST] : /v1/blog/post
router.post("/post", [body("title").isLength({ min: 5 }).withMessage("input minimum 5 karakter"), body("main").isLength({ min: 5 }).withMessage("input minimum 5 karakter")], blogController.createBlogPost);

// [GET] : /v1/blog/posts
router.get("/posts", blogController.getAllBlogPost);
router.get("/post/:postId", blogController.getBlogPostById);

// [PUT] : /v1/blog/posts
router.put("/post/:postId", [body("title").isLength({ min: 5 }).withMessage("input minimum 5 karakter"), body("main").isLength({ min: 5 }).withMessage("input minimum 5 karakter")], blogController.updateBlogPost);

// [DELETE] : /v1/blog/posts/:id
router.delete("/post/:postId", blogController.deleteBlogPost);

module.exports = router;
