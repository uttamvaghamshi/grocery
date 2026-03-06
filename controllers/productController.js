import Product from "../models/Product.js";
import ProductImage from "../models/ProductImages.js";
import { uploadImage } from "../utils/cloudinaryUpload.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, discount_price, stock, unit } =
      req.body;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      discount_price,
      stock,
      unit,
    });

    let images = [];

    if (req.files) {
      for (const file of req.files) {
        const result = await uploadImage(file.buffer, "products");

        const image = await ProductImage.create({
          product_id: product._id,
          image_url: result.secure_url,
          public_id: result.public_id,
        });

        images.push(image);
      }
    }

    res.status(201).json({ success: true, product, images });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    // Fetch all products as plain JS objects
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Get all product IDs
    const productIds = products.map((p) => p._id);

    // Fetch all images for these products
    const images = await ProductImage.find({ product_id: { $in: productIds } }).lean();

    // Map products with their corresponding images
    const productWithImages = products.map((product) => {
      return {
        ...product,
        images: images
          .filter((img) => img.product_id.toString() === product._id.toString())
          .map((img) => img.image_url), // Only return URLs
      };
    });

    res.json(productWithImages);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const images = await ProductImage.find({
      product_id: req.params.id,
    }).sort({ order: 1 });

    res.json({
      product,
      images,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    Object.assign(product, req.body);

    await product.save();

    // Existing images from frontend
    let existingImages = [];

    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    // Delete removed images
    await ProductImage.deleteMany({
      product_id: product._id,
      image_url: { $nin: existingImages },
    });

    // Add new images
    if (req.files && req.files.length > 0) {

      const newImages = req.files.map(file => ({
        product_id: product._id,
        image_url: file.path
      }));

      await ProductImage.insertMany(newImages);
    }

    const images = await ProductImage.find({
      product_id: product._id
    });

    res.json({
      success: true,
      product,
      images
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });

  }
};

export const addProductImages = async (req, res) => {
  try {
    const { product_id } = req.body;

    let images = [];

    for (const file of req.files) {
      const result = await uploadImage(file.buffer, "products");

      const image = await ProductImage.create({
        product_id,
        image_url: result.secure_url,
        public_id: result.public_id,
      });

      images.push(image);
    }

    res.json({
      success: true,
      images,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await ProductImage.deleteMany({
      product_id: req.params.id,
    });

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const deleteProductImage = async (req, res) => {
  try {
    const image = await ProductImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    await image.deleteOne();

    res.json({
      success: true,
      message: "Image deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
