import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

export const createProduct = async (_, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "At least one image is required.",
      });
    }
    if (!req.files || req.files.length > 3) {
      return res.status(400).json({
        message: "Maximum 3 images allowed.",
      });
    }

    const uploadPromises = req.files.map((file) => {
      return cloudinary.uploader.upload(file.path, {
        folder: "products",
      });
    });

    const uploadResults = await Promise.all(uploadPromises); // returns a secure url ==> the url cloudinary is storing the image at
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const product = await Product.crete({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      images: imageUrls,
    });

    return res
      .status(201)
      .json({ data: product, message: "Product successfully created." });
  } catch (error) {
    console.error("Error in createProduct controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllProducts = async (_, res) => {
  try {
    // -1 === desc order: most recent products first
    const products = await Product.find().sort({ createdAt: -1 });
    return res
      .status(200)
      .json({ data: products, message: "All products sucessfully fetched." });
  } catch (error) {
    console.error("Error in getAllProducts controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (category) product.category = category;

    // handle image updates if new images are uploaded
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }

      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });

      const uploadResults = await Promise.all(uploadPromises);
      product.images = uploadResults.map((result) => result.secure_url);
    }
    await product.save();
    return res
      .status(201)
      .json({ data: product, message: "Product successfully updated." });
  } catch (error) {
    console.error("Error in updateProducts controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (_, res) => {
  try {
    // send the last 5 items created
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 })
      .limit(5);
    // link user's name and email from user id in "order"

    return res
      .status(200)
      .json({ data: orders, message: "Latest orders successfully fetched." });
  } catch (error) {
    console.error("Error in getAllOrders controller: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.status = status;

    if (status === "Shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "Delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    await order.save();

    return res
      .status(200)
      .json({ data: order, message: "Order status successfully updated." });
  } catch (error) {
    console.error("Error in updateOrderStatus controller", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllCustomers = async (_, res) => {
  try {
    const customers = await User.find().sort({ createdAt: -1 }); // last created user first
    return res.status(200).json({
      data: customers,
      message: "All customers successfully fetched.",
    });
  } catch (error) {
    console.error("Error in getAllCustomers controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getDashboardStats = async (_, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
      },
      message: "Admin metrics successfully fetched.",
    });
  } catch (error) {
    console.error("Error in getDashboardStats controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Delete images from cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        // extract public_id from URL
        // assumes format: .../products/imagename.ext
        const publicId =
          "products/" + imageUrl.split("/products/")[1]?.split(".")[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      });

      await Promise.all(deletePromises.filter(Boolean));
    }
    await Product.findByIdAndDelete(id);

    return res.status(200).json({ message: "Product successfully deleted." });
  } catch (error) {
    console.error("Error in deleteProduct controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
