import express from "express";
import {
  createAddress,
  getUserAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress
} from "../controllers/addressController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createAddress);
router.get("/", protect, getUserAddresses);
router.get("/:id", protect, getSingleAddress);
router.put("/update/:id", protect, updateAddress);
router.delete("/delete/:id", protect, deleteAddress);

export default router;