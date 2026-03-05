import express from "express";

import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductImages,
  deleteProductImage,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", protect, upload.array("images", 5), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/update/:id", protect, updateProduct);

router.post(
  "/add-images",
  protect,
  upload.array("images", 5),
  addProductImages,
);

router.delete("/delete/:id", protect, deleteProduct);

router.delete("/image/:id", protect, deleteProductImage);

export default router;
