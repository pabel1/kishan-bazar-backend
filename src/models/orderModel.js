const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      postCode: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    paymentInfo: {
      paymentMethod: {
        type: String,
        required: true,
      },
      transactionId: {
        type: String,
      },
      subtotal: {
        type: Number,
        required: true,
      },
      shippingCost: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productname: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        stock: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paidAt: {
      type: Date,
      required: true,
    },

    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
    },
    orderId: {
      type: String,
      required: true,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
