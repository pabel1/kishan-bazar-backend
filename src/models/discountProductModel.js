// external import
const mongoose = require("mongoose");

const discountProductModel = new mongoose.Schema(
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
    discountInPercent: {
      type: Number,
      default: 0,
    },
    discountPrice: {
      type: Number,
      default: 0,
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

const DiscountProductModel = mongoose.model(
  "DiscountProduct",
  discountProductModel
);
module.exports = DiscountProductModel;
