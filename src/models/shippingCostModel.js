const mongoose = require("mongoose");
const shippingSchema = new mongoose.Schema(
  {
    insideDhaka: {
      type: Number,
      required: true,
    },
    outsideDhaka: {
      type: Number,
      required: true,
    },
    bkashNo: {
      type: String,
      required: true,
    },
    nagadNo: {
      type: String,
      required: true,
    },
    rocketNo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Shipping = mongoose.model("Shipping", shippingSchema);
module.exports = Shipping;
