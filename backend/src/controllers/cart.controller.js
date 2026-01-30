import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    // fetch the cart for the logged-in user
    // populate the product details in the cart items
    let cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    }).populate("items.product");

    if (!cart) {
      // if no cart exists, create an empty one
      const user = req.user;

      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    return res
      .status(200)
      .json({ data: cart, message: "Cart successfully fetched." });
  } catch (error) {
    console.error("Error in getCart controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // validate product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        error: "Insufficient stock available",
      });
    }

    let cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    });

    // create cart if it doesn't exist
    if (!cart) {
      const user = req.user;
      cart = await Cart.create({
        user: user._id,
        clerkId: user.clerkId,
        items: [],
      });
    }

    // check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      //increment quantity
      const newQuantity = existingItem.quantity + 1;
      if (product.stock < newQuantity) {
        return res.status(400).json({
          error: "Insufficient stock available",
        });
      }
      existingItem.quantity = newQuantity;
    } else {
      // add new item to cart
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    return res
      .status(200)
      .json({ data: cart, message: "Product successfully added to cart." });
  } catch (error) {
    console.error("Error in addToCart controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    });

    if (!cart) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    cart.items = [];
    await cart.save();

    return res.status(200).json({
      message: "Cart successfully cleared.",
      data: cart,
    });
  } catch (error) {
    console.error("Error in clearCart controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );
    await cart.save();
    return res
      .status(200)
      .json({ data: cart, message: "Item  removed from cart." });
  } catch (error) {
    console.error("Error in removeFromCart controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    // validate quantity
    if (!Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({
      clerkId: req.user.clerkId,
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // find the cart item

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.stock < qty) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // find the item in the cart
    cart.items[itemIndex].quantity = qty;
    await cart.save();

    return res.status(200).json({
      data: cart,
      message: "Cart item successfully updated.",
    });
  } catch (error) {
    console.error("Error in updateCartItem controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
