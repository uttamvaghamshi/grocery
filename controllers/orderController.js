import Cart from "../models/Cart.js";
import Order from "../models/OrderItem.js";
import Product from "../models/Product.js";
import ProductImage from "../models/ProductImages.js";


export const createOrder = async (req, res) => {
  try {

    const user_id = req.user.id;
    const { payment_method, delivery_address } = req.body;

    const cart = await Cart.findOne({ user_id })
      .populate("items.product_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let total_amount = 0;
    const orderItems = [];

    for (const item of cart.items) {

      const product = item.product_id;

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} items left`,
        });
      }

      const price = product.price;

      total_amount += price * item.quantity;

      orderItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price: price,
      });

      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user_id,
      items: orderItems,
      total_amount,
      payment_method,
      order_status: "pending",
      delivery_address,
    });

    await order.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });

  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch orders for this user
    const orders = await Order.find({ user_id })
      .populate("items.product_id")
      .sort({ createdAt: -1 })
      .lean(); // use lean for easy object manipulation

    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        orders: [],
      });
    }

    // Collect all product IDs from all orders
    const productIds = [];
    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product_id?._id) {
          productIds.push(item.product_id._id);
        }
      });
    });

    // Fetch images for all products
    const images = await ProductImage.find({ product_id: { $in: productIds } }).lean();

    // Merge images into order items
    const ordersWithImages = orders.map((order) => {
      const itemsWithImages = order.items.map((item) => {
        const product = { ...item.product_id };
        product.images = images
          .filter((img) => img.product_id.toString() === product._id.toString())
          .map((img) => img.image_url);

        return {
          ...item,
          product_id: product,
        };
      });

      return {
        ...order,
        items: itemsWithImages,
      };
    });

    res.json({
      success: true,
      orders: ordersWithImages,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: error.message });
  }
};
export const getSingleOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id)
      .populate("user_id")
      .populate("items.product_id")
      .lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Collect product ids
    const productIds = order.items.map((item) => item.product_id._id);

    // Fetch product images
    const images = await ProductImage.find({
      product_id: { $in: productIds },
    }).lean();

    // Attach single image
    order.items = order.items.map((item) => {
      const image = images.find(
        (img) =>
          img.product_id.toString() === item.product_id._id.toString()
      );

      return {
        ...item,
        product_id: {
          ...item.product_id,
          image: image ? image.image_url : null,
        },
      };
    });

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.order_status = "cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user_id")
      .populate("items.product_id")
      .sort({ createdAt: -1 })
      .lean();

    if (!orders || orders.length === 0) {
      return res.json({
        success: true,
        orders: [],
      });
    }

    // Collect all product ids
    const productIds = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.product_id && item.product_id._id) {
          productIds.push(item.product_id._id);
        }
      });
    });

    // Fetch images
    const images = await ProductImage.find({
      product_id: { $in: productIds },
    }).lean();

    const ordersWithImages = orders.map((order) => {

      const itemsWithImages = order.items.map((item) => {

        if (!item.product_id) {
          return item;
        }

        const product = { ...item.product_id };

        const image = images.find(
          (img) =>
            img.product_id &&
            product._id &&
            img.product_id.toString() === product._id.toString()
        );

        product.image = image ? image.image_url : null;

        return {
          ...item,
          product_id: product,
        };
      });

      return {
        ...order,
        items: itemsWithImages,
      };
    });

    res.json({
      success: true,
      orders: ordersWithImages,
    });

  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.order_status = status;

    await order.save();

    res.json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
