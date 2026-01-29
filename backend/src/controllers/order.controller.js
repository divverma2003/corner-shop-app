import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export const createOrder = async (req, res) => {
  try {
    const user = req.user;

    const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;

    // validate order items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        error: "No order items",
      });
    }

    // validate products and stock
    // todo: check frontend to verify this works
    for (const item of orderItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({
          error: `Product ${item.name} not found.`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}`,
        });
      }
    }

    const order = await Order.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    // update product stock
    // todo: check to confirm if working
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    return res
      .status(201)
      .json({ message: "Order created successfully: ", order });
  } catch (error) {
    console.error("Error in createOrder controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get orders for logged-in user
// include review status
export const getUserOrders = async (req, res) => {
  try {
    // fetch orders for the logged-in user
    const orders = await Order.find({
      clerkId: req.user.clerkId,
    })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });

    // check if each order has been reviewed
    // todo: check on frontend

    // check if each order has been reviewed
    const orderIds = orders.map((order) => order._id);

    // fetch reviews for these orders
    const reviews = await Review.find({
      orderId: { $in: orderIds },
    });

    // create a set of reviewed order IDs for quick lookup
    const reviewedOrderIds = new Set(
      reviews.map((review) => review.orderId.toString()),
    );

    // map orders to include review status
    const ordersWithReviewStatus = orders.map((order) => ({
      ...order.toObject(),
      hasReviewed: reviewedOrderIds.has(order._id.toString()),
    }));

    // respond with orders including review status
    return res.status(200).json({
      message: `Orders for user ${req.user.clerkId} fetched successfully.`,
      data: ordersWithReviewStatus,
    });
  } catch (error) {
    console.error("Error in getUserOrders controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
