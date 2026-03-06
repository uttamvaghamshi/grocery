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

router.post("/create", upload.array("images", 5), createProduct);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.put("/update/:id", updateProduct);

router.post(
  "/add-images",
  
  upload.array("images", 5),
  addProductImages,
);

router.delete("/delete/:id", deleteProduct);

router.delete("/image/:id", deleteProductImage);

export default router;
