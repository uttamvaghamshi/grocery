import Wishlist from "../models/Wishlist.js";
import ProductImage from "../models/ProductImages.js";
import Product from "../models/Product.js";

export const addToWishlist = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;

    const exists = await Wishlist.findOne({ user_id, product_id });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    const wishlist = await Wishlist.create({
      user_id,
      product_id,
    });

    const product = await Product.findById(product_id).lean();

    const image = await ProductImage.findOne({
      product_id: product_id,
    }).lean();

    const productWithImage = {
      ...product,
      image: image ? image.image_url : null,
    };

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: {
        ...wishlist._doc,
        product: productWithImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
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
      .populate("product_id")
      .lean();

    if (!wishlist || wishlist.length === 0) {
      return res.json({
        success: true,
        total: 0,
        data: [],
      });
    }

    const productIds = wishlist.map((item) => item.product_id._id);

    const images = await ProductImage.find({
      product_id: { $in: productIds },
    }).lean();

    const wishlistWithImages = wishlist.map((item) => {
      const product = { ...item.product_id };

      const image = images.find(
        (img) => img.product_id.toString() === product._id.toString()
      );

      product.image = image ? image.image_url : null;

      return {
        ...item,
        product_id: product,
      };
    });

    res.json({
      success: true,
      total: wishlistWithImages.length,
      data: wishlistWithImages,
    });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
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