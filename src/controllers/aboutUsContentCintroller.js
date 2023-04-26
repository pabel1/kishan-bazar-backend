const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");

const AboutUs = require("../models/aboutUsDynamicContentModel");

// creating a about us
exports.createAboutUs = catchAsyncError(async (req, res, next) => {
  const {
    title,
    subHeader,
    groupphoto,
    groupphotosecond,
    description,
    bgimage,
  } = req.body;
  if (
    !title ||
    !subHeader ||
    !groupphoto ||
    !groupphotosecond ||
    !description ||
    !bgimage
  ) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  await AboutUs.remove();
  const about = await AboutUs.create({
    title,
    subHeader,
    description,
    groupphoto,
    groupphotosecond,
    bgimage,
  });
  res.status(201).json({
    success: true,
    message: "About Created Successfully",
    about,
  });
});

// get all aboutus data
exports.getAllAboutusData = catchAsyncError(async (req, res, next) => {
  const about = await AboutUs.find();
  if (!about) {
    return next(new Errorhandeler("No About Data found", 404));
  }
  res.status(200).json({
    success: true,
    about,
  });
});

// update aboutus data
exports.updateAboutus = catchAsyncError(async (req, res, next) => {
  const {
    title,
    subHeader,
    groupphoto,
    groupphotosecond,
    description,
    bgimage,
  } = req.body;
  if (
    !title ||
    !subHeader ||
    !groupphoto ||
    !groupphotosecond ||
    !description ||
    !bgimage
  ) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  let about = await AboutUs.findById(req.params.id);
  if (!about) {
    return next(new Errorhandeler("Content  is not found", 404));
  }
  about = await AboutUs.findByIdAndUpdate(req.params.id, {
    title,
    subHeader,
    groupphoto,
    groupphotosecond,
    description,
    bgimage,
  });
  res.status(200).json({
    success: true,
    message: "About us content Updated successfully",
    about,
  });
});

// delete a about data
exports.deleteAboutUs = catchAsyncError(async (req, res, next) => {
  const about = await AboutUs.findById(req.params.id);
  if (!about) {
    return next(new Errorhandeler("This Data is not found", 404));
  }
  await about.remove();
  res.status(200).json({
    success: true,
    message: "About Us Content deleted successfully",
    about,
  });
});
