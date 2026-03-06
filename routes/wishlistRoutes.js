import express from "express";
import {
  addToWishlist,
  removeWishlist,
  getWishlist,
  toggleWishlist
} from "../controllers/wishlistController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/add",protect, addToWishlist);
router.delete("/remove/:product_id",protect, removeWishlist);
router.get("/",protect, getWishlist);
router.post("/toggle",protect, toggleWishlist);

export default router;