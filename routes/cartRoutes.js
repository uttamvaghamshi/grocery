import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  getCartCount,
  increaseQuantity,
  decreaseQuantity,
} from "../controllers/cartController.js";

import {protect} from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/add", protect, addToCart);

router.get("/", protect, getCart);

router.put("/update", protect, updateCartItem);

router.delete("/remove/:product_id", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

router.get("/count", protect, getCartCount);

router.put("/increase", protect, increaseQuantity);

router.put("/decrease", protect, decreaseQuantity);

export default router;
