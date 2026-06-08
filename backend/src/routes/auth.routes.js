const express = require("express");
const { registerSchema, loginSchema } = require("../validators/auth.schema");
const authController = require("../controllers/auth.controller");
const { validateBody } = require("../middleware/validate");
const { requireAuth } = require("../middleware/authMiddleware");
const { authLoginLimiter, authRegisterLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post(
  "/register",
  authRegisterLimiter,
  validateBody(registerSchema),
  authController.register
);

router.post(
  "/login",
  authLoginLimiter,
  validateBody(loginSchema),
  authController.login
);

router.post("/logout", authController.logout);

router.get("/me", requireAuth, authController.me);

module.exports = router;

