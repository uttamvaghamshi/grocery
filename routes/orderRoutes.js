import express from "express";
import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";


const router = express.Router();

router.post("/create", createOrder);

router.get("/my-orders", getMyOrders);

router.get("/:order_id", getSingleOrder);

router.put("/cancel/:order_id", cancelOrder);

// admin
router.get("/admin/all", getAllOrders);

router.put("/admin/update-status/:order_id", updateOrderStatus);

export default router;
