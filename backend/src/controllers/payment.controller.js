import Stripe from "stripe";
import { ENV } from "../config/env.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY);

// This controller creates a payment intent based on the cart items and shipping address sent from the client.
export const createPaymentIntent = async (req, res) => {
  // The client will send the cart items and shipping address in the request body.
  try {
    // extract cart items and shipping address from request body
    const { cartItems, shippingAddress } = req.body;
    const user = req.user;

    // validate cart items
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Calculate total from server-side (don't trust client)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      // check if product exists
      if (!product) {
        return res
          .status(400)
          .json({ error: `Product not found: ${item.product._id}` });
      }

      // check if stock is sufficient
      if (product.stock < item.quantity) {
        return res
          .status(400)
          .json({ error: `Insufficient stock for product: ${product.name}` });
      }
      // calculate subtotal
      subtotal += product.price * item.quantity;

      // add validated item to the list
      validatedItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0],
      });
    }

    const shipping = subtotal > 45 ? 5.99 : 0; // flat shipping rate for simplicity
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + shipping + tax;

    if (total <= 0) {
      return res
        .status(400)
        .json({ error: "Total amount must be greater than zero" });
    }

    // find or create the stripe customer
    let customer;
    if (user.stripeCustomerId) {
      // find the customer
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    } else {
      // create a new customer in Stripe
      customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          clerkId: user.clerkId,
          userId: user._id.toString(),
        },
      });

      // add the stripe customer ID to the user object in the DB
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customer.id });
    }

    // create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // amount in cents
      currency: "usd",
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        clerkId: user.clerkId,
        userId: user._id.toString(),
        orderItems: JSON.stringify(validatedItems),
        shippingAddress: JSON.stringify(shippingAddress),
        totalPrice: total.toFixed(2),
      },
      // in the webhooks section we will use this metadata
    });

    return res.status(200).json({
      data: {
        clientSecret: paymentIntent.client_secret,
      },
      message: "Payment intent created successfully",
    });
  } catch (error) {
    console.error("Error in createPaymentIntent controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const handleWebhook = async (req, res) => {
  // Stripe sends the event data in the request body, and the signature in the headers. We need to verify the signature to ensure the request is from Stripe.
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      ENV.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Error in handleWebhook controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    console.log("PaymentIntent was successful!", paymentIntent);

    // Here you would create an order in your database, reduce stock, etc.
    try {
      const { userId, clerkId, orderItems, shippingAddress, totalPrice } =
        paymentIntent.metadata;

      // check if order already exists (idempotency)
      const existingOrder = await Order.findOne({
        "paymentResult.id": paymentIntent.id,
      });

      if (existingOrder) {
        console.log(
          "Order already exists for this payment intent, skipping creation.",
        );
        return res.status(200).json({ received: true });
      }

      // create the order
      const order = new Order.create({
        user: userId,
        clerkId,
        orderItems: JSON.parse(orderItems),
        shippingAddress: JSON.parse(shippingAddress),
        paymentResult: {
          id: paymentIntent.id,
          status: "succeeded",
        },
        totalPrice: parseFloat(totalPrice),
      });

      // update product stock
      const items = JSON.parse(orderItems);
      for (const item of items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }

      console.log("Order created successfully:", order);
    } catch (error) {
      console.error("Error processing payment intent webhook:", error);
    }
  }

  return res.status(200).json({ received: true });
};
