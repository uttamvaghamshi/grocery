import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

router.post("/register", upload.single("image"), registerUser);
router.post("/login", loginUser);
router.get("/profile", getUserProfile);
router.put(
  "/update-profile",
  upload.single("image"),
  updateUserProfile,
);

export default router;
