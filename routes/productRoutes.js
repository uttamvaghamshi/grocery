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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create", upload.single("images"), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/update/:id", upload.single("images"), updateProduct);

router.post(
  "/add-images",
  
  upload.single("images"),
  addProductImages,
);

router.delete("/delete/:id", deleteProduct);

router.delete("/image/:id", deleteProductImage);

export default router;
