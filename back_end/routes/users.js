const express = require("express");
const router = express.Router();

// Import controller yang baru dibuat
const userController = require("../controllers/userController");

// Petakan rute ke fungsi controller-nya masing-masing
router.post("/api/user/register", userController.register);
router.post("/api/user/login", userController.login);
router.get("/api/user/refresh", userController.refresh);
router.post("/api/user/logout", userController.logout);

module.exports = router;