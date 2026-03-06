import Cart from "../models/Cart.js";
import Order from "../models/OrderItem.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { payment_method, delivery_address } = req.body;

    const cart = await Cart.findOne({ user_id }).populate("items.product_id");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let total_amount = 0;

    const orderItems = cart.items.map((item) => {
      const price = item.product_id.price;

      total_amount += price * item.quantity;

      return {
        product_id: item.product_id._id,
        quantity: item.quantity,
        price: price,
      };
    });

    const order = new Order({
      user_id,
      items: orderItems,
      total_amount,
      payment_method,
      delivery_address,
    });

    await order.save();

    // clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;

    const orders = await Order.find({ user_id })
      .populate({
        path: "items.product_id",
        select: "name price description images unit",
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const { order_id } = req.params;

    const order = await Order.findById(order_id).populate("items.product_id");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
