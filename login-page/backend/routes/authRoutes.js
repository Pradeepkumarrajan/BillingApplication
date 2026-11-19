const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.get("/profile", verifyToken, (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

module.exports = router;
const forgotPasswordController =
  require("../controllers/forgotPasswordController");

  router.post(
  "/forgot-password/send-otp",
  forgotPasswordController.sendOTP
);

router.post(
  "/forgot-password/reset",
  forgotPasswordController.resetPassword
);