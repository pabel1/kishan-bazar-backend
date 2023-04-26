// internal import
const catchAsyncError = require("../middlewares/catchAsyncError");
const Visitor = require("../models/visitorModel");

// create a visior
exports.createVisitor = catchAsyncError(async (req, res, next) => {
  const { visitor } = req.body;
  const visitorData = await Visitor.create({ visitor });
  res.status(201).json({
    success: true,
    visitorData,
  });
});

exports.getAllVisitor = catchAsyncError(async (req, res, next) => {
  const numofVisitor = await Visitor.find().countDocuments();
  res.status(200).json({
    success: true,
    numofVisitor,
  });
});
