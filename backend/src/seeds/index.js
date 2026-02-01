import mongoose from "mongoose";
import { Product } from "../models/product.model.js";
import { ENV } from "../config/env.js";

const categories = ["Clothing", "Accessories", "Home Decor", "Hobbies"];
const getCategory = (name) => {
  return categories.find((cat) => cat === name);
};
const products = [
  {
    name: "Ugly Christmas Sweater",
    description: "A festive sweater to celebrate the holiday season in style.",
    price: 29.99,
    stock: 25,
    category: getCategory("Clothing"),
    images: [
      "https://images.unsplash.com/photo-1607575664476-c7772f6d8a42?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 10,
  },
  {
    name: "Paint Set",
    description: "A complete set of acrylic paints for artists of all levels.",
    price: 19.99,
    stock: 50,
    category: getCategory("Hobbies"),
    images: [
      "https://plus.unsplash.com/premium_photo-1669869388558-f7eb780f9af8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      "https://images.unsplash.com/photo-1596567181723-ba7d15eacefb?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
    ],
    averageRating: 4.5,
    totalReviews: 8,
  },
  {
    name: "Decorative Throw Pillow",
    description:
      "A stylish throw pillow to add a pop of color to your living room.",
    price: 15.99,
    stock: 40,
    category: getCategory("Home Decor"),
    images: [
      "https://images.unsplash.com/photo-1691256676366-370303d55b61?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      "https://plus.unsplash.com/premium_photo-1672882595904-9c1a8e8d89b6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
      "https://plus.unsplash.com/premium_photo-1676454000663-643ab3995b55?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
    ],
    averageRating: 4.7,
    totalReviews: 16,
  },
  {
    name: "Leather Wallet",
    description:
      "A durable leather wallet with multiple compartments for cards and cash.",
    price: 39.99,
    stock: 30,
    category: getCategory("Accessories"),
    images: [
      "https://plus.unsplash.com/premium_photo-1681589452811-513d1952077c?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHdhbGxldHxlbnwwfHwwfHx8MA%3D%3D?w=500",
      "https://images.unsplash.com/photo-1614330315526-166f2d71e544?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhbGxldHxlbnwwfHwwfHx8MA%3D%3D?w=500",
      "https://images.unsplash.com/photo-1614330315994-efd5ea8163a1?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 12,
  },
  {
    name: "Polka Dot Skirt",
    description: "A fun polka dot skirt perfect for summer outings.",
    price: 24.99,
    stock: 20,
    category: getCategory("Clothing"),
    images: [
      "https://images.unsplash.com/photo-1603290939650-b553549a5739?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cG9sa2ElMjBkb3QlMjBza2lydHxlbnwwfHwwfHx8MA%3D%3D?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 20,
  },
  {
    name: "Scented Candles Set",
    description:
      "A set of scented candles to create a relaxing ambiance in your home.",
    price: 22.99,
    stock: 35,
    category: getCategory("Home Decor"),
    images: [
      "https://images.unsplash.com/photo-1759496330502-3965f119abbf?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNhbmRsZXMlMjBzZXR8ZW58MHx8MHx8fDA%3D?w=500",
    ],
    averageRating: 4.9,
    totalReviews: 46,
  },
  {
    name: "Crochet Kit",
    description:
      "A beginner-friendly crochet kit with all the materials you need.",
    price: 18.99,
    stock: 45,
    category: getCategory("Hobbies"),
    images: [
      "https://plus.unsplash.com/premium_photo-1675799641577-ed4f79f91c32?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3JvY2hldCUyMGtpdHxlbnwwfHwwfHx8MA%3D%3D?w=500",
      "https://plus.unsplash.com/premium_photo-1675799745857-d94e32a43849?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGNyb2NoZXQlMjBraXR8ZW58MHx8MHx8fDA%3D?w=500",
      "https://images.unsplash.com/photo-1755315897817-97bd6ec34256?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNyb2NoZXQlMjBraXR8ZW58MHx8MHx8fDA%3D?w=500",
    ],
    averageRating: 4.4,
    totalReviews: 9,
  },
  {
    name: "Embroidered Boot-cut Jeans",
    description: "Stylish boot-cut jeans with intricate embroidery details.",
    price: 49.99,
    stock: 15,
    category: getCategory("Clothing"),
    images: [
      "https://plus.unsplash.com/premium_photo-1763729234910-a6e01f9b5d3e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZW1icm9pZGVyZWQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D?w=500",
      "https://images.unsplash.com/photo-1713472684271-18bd40b9e0b6?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1icm9pZGVyZWQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D?w=500",
      "https://plus.unsplash.com/premium_photo-1765841918672-ea61183e797f?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZW1icm9pZGVyZWQlMjBqZWFuc3xlbnwwfHwwfHx8MA%3D%3D?w=500",
    ],
    averageRating: 4.8,
    totalReviews: 14,
  },
  {
    name: "Vintage Sunglasses",
    description:
      "Classic vintage-style sunglasses with UV protection for your eyes.",
    price: 34.99,
    stock: 25,
    category: getCategory("Accessories"),
    images: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3VuZ2xhc3Nlc3xlbnwwfHwwfHx8MA%3D%3D?w=500",
    ],
    averageRating: 4.6,
    totalReviews: 18,
  },
  {
    name: "Vinyl Record Player",
    description:
      "A retro-style vinyl record player for music enthusiasts and collectors.",
    price: 89.99,
    stock: 10,
    category: getCategory("Hobbies"),
    images: [
      "https://images.unsplash.com/photo-1526394931762-90052e97b376?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmlueWx8ZW58MHx8MHx8fDA%3D?w=500",
      "https://plus.unsplash.com/premium_photo-1712844228232-0a76dacc4ddf?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fHZpbnlsfGVufDB8fDB8fHww%3D?w=500",
    ],
    averageRating: 4.9,
    totalReviews: 22,
  },
];

const seedProductsToDB = async () => {
  try {
    // connect to MongoDB
    await mongoose.connect(ENV.DB_URL);
    console.log("✅ Connected to MongoDB");

    // clear existing products
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    //insert seed products
    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products into the database`);

    // display summary

    const insertedCategories = [...new Set(products.map((p) => p.category))];
    console.log("\n📦 Seeded Product Summary:");
    console.log(`Total Products: ${products.length}`);
    console.log(`Categories: ${insertedCategories.join(", ")}`);

    // close the connection
    await mongoose.connection.close();
    console.log("\n✅ Database seeding completed and connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedProductsToDB();
