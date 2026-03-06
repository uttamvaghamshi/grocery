import express from "express";
import {
  addToWishlist,
  removeWishlist,
  getWishlist,
  toggleWishlist
} from "../controllers/wishlistController.js";


const router = express.Router();

router.post("/add", addToWishlist);
router.delete("/remove/:product_id", removeWishlist);
router.get("/", getWishlist);
router.post("/toggle", toggleWishlist);

export default router;