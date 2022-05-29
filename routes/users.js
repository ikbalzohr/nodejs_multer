const express = require("express");
const { body } = require("express-validator");

const usersController = require("../controllers/users");

const router = express.Router();

// [POST] : /v1/blog/post
router.post("/list", [body("nama").isLength({ min: 1 }).withMessage("input minimum 1 karakter"), body("noWa").isLength({ min: 11 }).withMessage("input minimum 11 karakter")], usersController.createUsers);

// [GET] : /v1/blog/posts
router.get("/list", usersController.getAllUsers);
router.get("/list/:userId", usersController.getUsersById);

// [PUT] : /v1/blog/posts
router.put("/list/:userId", [body("nama").isLength({ min: 1 }).withMessage("input minimum 1 karakter"), body("noWa").isLength({ min: 11 }).withMessage("input minimum 11 karakter")], usersController.updateUsers);

// [DELETE] : /v1/blog/posts/:id
router.delete("/list/:userId", usersController.deleteUsers);

module.exports = router;
