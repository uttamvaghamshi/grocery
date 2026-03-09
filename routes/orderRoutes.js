import express from "express";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create",protect, createOrder);

router.get("/my-orders",protect, getMyOrders);

router.get("/:order_id", getSingleOrder);

router.put("/cancel/:order_id",protect, cancelOrder);

// admin
router.get("/admin/all", getAllOrders);

router.put("/admin/update-status/:order_id", updateOrderStatus);

export default router;
