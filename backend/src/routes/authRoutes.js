import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  changePassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getMe);
router.post("/change-password", protect, changePassword);

export default router;