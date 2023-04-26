// external import

// internal import
const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");
const CouponModel = require("../models/couponModel");

// create campaign
exports.createCupon = catchAsyncError(async (req, res, next) => {
  const { name, code, discountPercent, validationDate, discountType } =
    req.body;
  if (!name || !code || !discountPercent || !validationDate || !discountType) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }

  const cuponcode = await CouponModel.create({
    code,
    name,
    discountPercent,
    validationDate,
    discountType,
  });
  res.status(201).json({
    success: true,
    message: "Cupon Code Generated Successfully",
    cuponcode,
  });
});

// delete
exports.deleteCupon = catchAsyncError(async (req, res, next) => {
  const cupon = await CouponModel.findById(req.params.id);
  if (!cupon) {
    return next(new Errorhandeler("Coupon is not found", 404));
  }
  await cupon.remove();
  res.status(200).json({
    success: true,
    message: "Coupon deleted successfully",
    cupon,
  });
});

exports.updateCupon = catchAsyncError(async (req, res, next) => {
  const { code, name, discountPercent, validationDate, discountType } =
    req.body;

  let cupon = await CouponModel.findById(req.params.id);
  if (!cupon) {
    return next(new Errorhandeler("Coupon is not found", 404));
  }
  if (!name && !code && !discountPercent && !validationDate && !discountType) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  cupon = await CouponModel.findByIdAndUpdate(req.params.id, {
    code,
    name,
    discountPercent,
    validationDate,
    discountType,
  });
  res.status(200).json({
    success: true,
    message: "Cupon Updated successfully",
    cupon,
  });
});

// get all
exports.getAllCupon = catchAsyncError(async (req, res, next) => {
  let pageno = Number(req.params.page) || 1;
  let perpage = Number(req.params.limit) || 10;

  let skipRow = (pageno - 1) * perpage;
  const cupon = await CouponModel.find()
    .skip(skipRow)
    .limit(perpage)
    .sort({ createdAt: -1 });
  if (!cupon) {
    return next(new Errorhandeler("Not Exist", 404));
  }
  res.status(200).json({
    success: true,
    cupon,
  });
});

// get a cupon
exports.getACupon = catchAsyncError(async (req, res, next) => {
  const cupon = await CouponModel.findOne({ code: req.params.cupon });
  if (!cupon) {
    return next(new Errorhandeler("No Coupon Code Found", 404));
  }
  res.status(200).json({
    success: true,
    cupon,
  });
});
