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


const router = express.Router();

router.post("/add", addToCart);

router.get("/", getCart);

router.put("/update", updateCartItem);

router.delete("/remove/:product_id", removeCartItem);

router.delete("/clear", clearCart);

router.get("/count", getCartCount);

router.put("/increase", increaseQuantity);

router.put("/decrease", decreaseQuantity);

export default router;
