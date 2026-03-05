import express from "express";
import {
  getAllUsers,
  getUserById,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUser,
} from "../controllers/adminUserController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

router.get("/users/:id", protect, authorizeRoles("admin"), getUserById);

router.post("/users", protect, authorizeRoles("admin"), createUserByAdmin);

router.put("/users/:id", protect, authorizeRoles("admin"), updateUserByAdmin);

router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;
