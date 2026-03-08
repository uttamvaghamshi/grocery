import Product from "../models/Product.js";
import ProductImage from "../models/ProductImages.js";
import { uploadImage } from "../utils/cloudinaryUpload.js";
import { deleteCloudinaryImage } from "../utils/deleteCloudinaryImage.js";


export const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, discount_price, stock, unit } =
      req.body;

    // Create product
    const product = await Product.create({
      name,
      description,
      category,
      price,
      discount_price,
      stock,
      unit,
    });

    let image = null;

    // Single image upload
    if (req.file) {
      const result = await uploadImage(req.file.buffer, "products");

      image = await ProductImage.create({
        product_id: product._id,
        image_url: result.secure_url,
        public_id: result.public_id,
      });
    }

    res.status(201).json({
      success: true,
      product,
      image,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    // Fetch all products
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    // Get all product IDs
    const productIds = products.map((p) => p._id);

    // Fetch images
    const images = await ProductImage.find({
      product_id: { $in: productIds },
    }).lean();

    // Map single image with product
    const productWithImage = products.map((product) => {
      const image = images.find(
        (img) => img.product_id.toString() === product._id.toString()
      );

      return {
        ...product,
        image: image ? image.image_url : null,
      };
    });

    res.json({
      success: true,
      total: productWithImage.length,
      products: productWithImage,
    });
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
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get single image
    const image = await ProductImage.findOne({
      product_id: req.params.id,
    }).lean();

    res.json({
      success: true,
      product: {
        ...product,
        image: image ? image.image_url : null,
      },
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

    // Update product fields
    Object.assign(product, req.body);
    await product.save();

    let image = await ProductImage.findOne({
      product_id: product._id,
    });

    // If new image uploaded
    if (req.file) {
      const result = await uploadImage(req.file.buffer, "products");

      if (image) {
        // Update existing image
        image.image_url = result.secure_url;
        image.public_id = result.public_id;
        await image.save();
      } else {
        // Create new image
        image = await ProductImage.create({
          product_id: product._id,
          image_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    res.json({
      success: true,
      product,
      image: image ? image.image_url : null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
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

    // get product images
    const images = await ProductImage.find({
      product_id: req.params.id,
    });

    // delete images from Cloudinary
    for (const img of images) {
      await deleteCloudinaryImage(img.image_url);
    }

    // delete image records
    await ProductImage.deleteMany({
      product_id: req.params.id,
    });

    // delete product
    await product.deleteOne();

    res.json({
      success: true,
      message: "Product and images deleted successfully",
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

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({ category });

    res.json({
      success: true,
      total: products.length,
      products,
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getRecentProducts = async (req, res) => {
  try {

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      total: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};
