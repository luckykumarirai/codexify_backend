const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middleware/auth");

router.post("/register", userController.Register);
router.post("/login", userController.Login);
router.get("/users", checkAuth, userController.GetUsers);
router.get("/userById/:id", userController.GetUserById);

module.exports = router;
