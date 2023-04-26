const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter coupon name"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Please enter coupon code"],
      trim: true,
    },
    discountPercent: {
      type: String,
      required: [true, "Please enter coupon discount percent"],
      trim: true,
    },
    discountType: {
      type: String,
      required: [true, "Please enter discount type"],
      trim: true,
    },
    validationDate: {
      type: Date,
      required: [true, "Please enter cupon vlidation date"],
    },
  },
  { timestamps: true }
);
couponSchema.index({ "validationDate": 1 }, { expireAfterSeconds: 0 } )
const CouponModel = mongoose.model("Coupon", couponSchema);
module.exports = CouponModel;
