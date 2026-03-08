import Cart from "../models/Cart.js";
import ProductImage from "../models/ProductImages.js";
import Product from "../models/Product.js";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImage.js";

export const addToCart = async (req, res) => {
  try {

    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    const qty = Number(quantity) || 1;

    // check product exists
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      cart = new Cart({
        user_id,
        items: [{ product_id, quantity: qty }]
      });

      await cart.save();

    } else {

      const itemIndex = cart.items.findIndex(
        item => item.product_id.toString() === product_id
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({
          product_id,
          quantity: qty
        });
      }

      await cart.save();
    }

    const populatedCart = await Cart.findOne({ user_id })
      .populate("items.product_id")
      .lean();

    const validItems = populatedCart.items.filter(
      item => item.product_id
    );

    const productIds = validItems.map(
      item => item.product_id._id
    );

    const images = await ProductImage.find({
      product_id: { $in: productIds }
    }).lean();

    const imageMap = {};
    images.forEach(img => {
      imageMap[img.product_id] = img.image_url;
    });

    const items = validItems.map(item => ({
      product_id: item.product_id._id,
      quantity: item.quantity,
      product: {
        ...item.product_id,
        image: imageMap[item.product_id._id] || null
      }
    }));

    res.json({
      success: true,
      message: "Product added to cart",
      total_items: items.length,
      items
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });

  }
};


export const getCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const cart = await Cart.findOne({ user_id })
      .populate("items.product_id")
      .lean();

    if (!cart) {
      return res.json({
        success: true,
        items: [],
      });
    }

    const productIds = cart.items.map((item) => item.product_id._id);

    const images = await ProductImage.find({
      product_id: { $in: productIds },
    }).lean();

    const itemsWithImages = cart.items.map((item) => {
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
      cart: {
        ...cart,
        items: itemsWithImages,
      },
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product_id.toString() === product_id,
    );

    if (!item) {
      return res.status(404).json({
        message: "Product not in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.params;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product_id.toString() !== product_id,
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.json({
      success: true,
      message: "Cart cleared",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCartCount = async (req, res) => {
  try {
    const user_id = req.user.id;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.json({ count: 0 });
    }

    const count = cart.items.reduce((total, item) => {
      return total + item.quantity;
    }, 0);

    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const increaseQuantity = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.product_id.toString() === product_id,
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    item.quantity += 1;

    await cart.save();

    res.json({
      success: true,
      message: "Quantity increased",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id } = req.body;

    const cart = await Cart.findOne({ user_id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product_id.toString() === product_id,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not in cart",
      });
    }

    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    res.json({
      success: true,
      message: "Quantity decreased",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
