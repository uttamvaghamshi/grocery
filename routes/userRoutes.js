import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/profile",protect, getUserProfile);
router.put(
  "/update-profile",
  protect,
  upload.single("image"),
  updateUserProfile,
);

export default router;
