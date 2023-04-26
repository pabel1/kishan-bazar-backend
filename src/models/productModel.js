// external import
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, "Please enter product Id"],
      unique: true,
      trim: true,
    },
    productname: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
    },
    demoprice: {
      type: Number,
      default : 0
    },
    brand: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: [true, "Please enter product image"],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    subcategory: {
      type: String,
      trim: true,
      lowercase: true,
    },
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      maxLength: [4, "Stock cannot exceed 4 characters"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
