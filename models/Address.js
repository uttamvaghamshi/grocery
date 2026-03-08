import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    house_no: {
      type: String,
      required: true,
    },

    street: {
      type: String,
    },

    country: {
      type: String,
      required: true
    },

    city: {
      type: String,
      default: "Surat",
    },

    state: {
      type: String,
      default: "Gujarat",
    },

    pincode: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);