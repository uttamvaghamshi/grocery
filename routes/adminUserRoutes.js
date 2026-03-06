import express from "express";
import {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUser,
} from "../controllers/adminUserController.js";

import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/users", protect, getAllUsers);

router.get("/users/:id", protect, getUserById);

router.post("/users", protect, createUserByAdmin);

router.put("/users/:id", protect, updateUserByAdmin);

router.delete("/users/:id", protect, deleteUser);

export default router;
