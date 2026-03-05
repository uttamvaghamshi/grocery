import express from "express";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/:order_id", protect, getSingleOrder);

router.put("/cancel/:order_id", protect, cancelOrder);

// admin
router.get("/admin/all", protect, getAllOrders);

router.put("/admin/update-status/:order_id", protect, updateOrderStatus);

export default router;
