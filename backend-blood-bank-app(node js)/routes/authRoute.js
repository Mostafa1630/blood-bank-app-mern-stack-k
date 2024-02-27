const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verfiyToken");
const {
  registerController,
  loginController,
  getCurrentUserController,
} = require("../controller/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/currentUser", verifyToken, getCurrentUserController);

module.exports = router;
