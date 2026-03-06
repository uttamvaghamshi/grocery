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

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.post("/users", createUserByAdmin);

router.put("/users/:id", updateUserByAdmin);

router.delete("/users/:id", deleteUser);

export default router;
