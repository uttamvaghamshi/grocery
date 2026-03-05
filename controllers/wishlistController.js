import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res) => {
  try {

    const user_id = req.user.id;
    const { product_id } = req.body;

    const exists = await Wishlist.findOne({ user_id, product_id });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    const wishlist = await Wishlist.create({
      user_id,
      product_id
    });

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};


export const removeWishlist = async (req, res) => {
  try {

    const user_id = req.user.id;
    const { product_id } = req.params;

    const removed = await Wishlist.findOneAndDelete({
      user_id,
      product_id
    });

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Product not found in wishlist"
      });
    }

    res.json({
      success: true,
      message: "Removed from wishlist"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const getWishlist = async (req, res) => {
  try {

    const user_id = req.user.id;

    const wishlist = await Wishlist.find({ user_id })
      .populate({
        path: "product_id",
        populate: {
          path: "store_id"
        }
      });

    res.json({
      success: true,
      total: wishlist.length,
      data: wishlist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

export const toggleWishlist = async (req, res) => {
  try {

    const user_id = req.user.id;
    const { product_id } = req.body;

    const exists = await Wishlist.findOne({ user_id, product_id });

    if (exists) {

      await exists.deleteOne();

      return res.json({
        success: true,
        message: "Removed from wishlist"
      });

    }

    await Wishlist.create({ user_id, product_id });

    res.json({
      success: true,
      message: "Added to wishlist"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Server Error"
    });

  }
};