import mongoose from "mongoose";

import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating } = req.body;

    if (!productId || !orderId) {
      return res.status(400).json({
        error: "productId and orderId are required",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be between 1 and 5.",
      });
    }

    const user = req.user;

    // verify order exists and is delivered
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        error: "Order not found.",
      });
    }

    if (order.clerkId !== user.clerkId) {
      return res.status(403).json({
        error: "Not authorized to review this order.",
      });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        error: "Can only review delivered orders.",
      });
    }

    // verify product is in the order
    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!productInOrder) {
      return res.status(400).json({
        error: "Product not found in this order",
      });
    }

    // check if review already exists
    const review = await Review.findOneAndUpdate(
      { productId, userId: user._id },
      { rating, orderId, productId, userId: user._id },
      { new: true, upsert: true, runValidators: true },
    );

    // update the product rating with atomic aggregation
    const reviews = await Review.aggregate([
      // first, match reviews for the specific product
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        // then, group to calculate avg rating and count
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    // then, update the product with these stats
    const stats = reviews[0] || { avgRating: 0, count: 0 };
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      averageRating: stats.avgRating,
      totalReviews: stats.count,
    });

    if (!updatedProduct) {
      await Review.findByIdAndDelete(review._id);
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res
      .status(201)
      .json({ message: "Review submitted successfully: ", review });
  } catch (error) {
    console.error("Error in createReview controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({
        error: "Review not found",
      });
    }
    if (review.userId.toString() !== user._id.toString()) {
      return res.status(403).json({
        error: "You're not authorized to delete this review.",
      });
    }

    // delete review and update product ratings
    const productId = review.productId;
    await Review.findByIdAndDelete(reviewId);
    const reviews = await Review.find({ productId });

    // recalculate average rating and total reviews
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    await Product.findByIdAndUpdate(productId, {
      averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
      totalReviews: reviews.length,
    });

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error in deleteReview controller: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
