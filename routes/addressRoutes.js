import express from "express";
import {
  createAddress,
  getUserAddresses,
  getSingleAddress,
  updateAddress,
  deleteAddress
} from "../controllers/addressController.js";


const router = express.Router();

router.post("/create", createAddress);
router.get("/", getUserAddresses);
router.get("/:id", getSingleAddress);
router.put("/update/:id", updateAddress);
router.delete("/delete/:id", deleteAddress);

export default router;