const catchAsyncError = require("../middlewares/catchAsyncError");
const Shipping = require("../models/shippingCostModel");
const Errorhandeler = require("../utility/ErrorHandler");

exports.createShipping = catchAsyncError(async (req, res, next) => {
  const { insideDhaka, outsideDhaka, bkashNo, nagadNo, rocketNo } = req.body;
  if (!insideDhaka || !outsideDhaka || !bkashNo || !nagadNo || !rocketNo) {
    return next(new Errorhandeler("Please fill the required field", 400));
  }

  const shippingCost = await Shipping.create({
    insideDhaka,
    outsideDhaka,
    bkashNo,
    nagadNo,
    rocketNo,
  });
  res.status(201).json({
    success: true,
    message: "Shipping Created successfully",
    shippingCost,
  });
});

exports.getAllShipping = catchAsyncError(async (req, res, next) => {
  const shippingCost = await Shipping.find();
  if (!shippingCost) {
    return next(new Errorhandeler("Shipping not found", 404));
  }
  res.status(200).json({
    success: true,
    shippingCost,
  });
});

exports.UpdateShipping = catchAsyncError(async (req, res, next) => {
  const { insideDhaka, outsideDhaka, bkashNo, nagadNo, rocketNo } = req.body;
  let shippingCost = await Shipping.findById(req.params.id);
  if (!shippingCost) {
    return next(new Errorhandeler("Shipping not found", 404));
  }
  shippingCost = await Shipping.findByIdAndUpdate(req.params.id, {
    insideDhaka,
    outsideDhaka,
    bkashNo,
    nagadNo,
    rocketNo,
  });
  res.status(200).json({
    success: true,
    message: "Shipping Updated successfully",
    shippingCost,
  });
});

// delete order --admin
exports.deleteShipping = catchAsyncError(async (req, res, next) => {
  const shippingCost = await Shipping.findById(req.params.id);
  if (!shippingCost) {
    return next(new Errorhandeler("Shipping not found with this id", 404));
  }
  await shippingCost.remove();
  res.status(200).json({
    success: true,
    message: "Shipping deleted successfully",
  });
});
