import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    image_url: {
      type: String,
      required: true,
    },

    public_id: {
      type: String,
    },
  },
  { timestamps: true },
);

const ProductImage = mongoose.model("ProductImage", productImageSchema);

export default ProductImage;
