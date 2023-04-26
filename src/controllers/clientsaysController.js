// external import
const ClientSay = require("../models/clientsaysModel");
const cloudinary = require("cloudinary");

// internal import
const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");

// creating client
exports.createClient = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image } = req.body;
  if (!name || !designation || !description || !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  const myCloud = await cloudinary.v2.uploader.upload(image, {
    folder: "krishan_bazar_clients",
  });
  const client = await ClientSay.create({
    name,
    designation,
    description,
    image: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });
  res.status(201).json({
    success: true,
    message: "Client Created Successfully",
    client,
  });
});

// get all clients
exports.getAllClient = catchAsyncError(async (req, res, next) => {
  const clients = await ClientSay.find();
  if (!clients) {
    return next(new Errorhandeler("No clients found", 404));
  }
  res.status(200).json({
    success: true,
    clients,
  });
});

// get all clients
exports.deleteClient = catchAsyncError(async (req, res, next) => {
  const client = await ClientSay.findById(req.params.id);
  if (!client) {
    return next(new Errorhandeler("Client not found", 404));
  }
  // Removing image from cloudinary
  await cloudinary.v2.uploader.destroy(client?.image?.public_id);
  await client.remove();
  res.status(200).json({
    success: true,
    message: "Client deleted successfully",
    client,
  });
});

//update clients
exports.updateClient = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image, base64 } = req.body;
  if (!name && !designation && !description && !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  let client = await ClientSay.findById(req.params.id);
  if (!client) {
    return next(new Errorhandeler("Client not found", 404));
  }
  // Removing image from cloudinary
  await cloudinary.v2.uploader.destroy(client?.image?.public_id);

  // Adding updated image to cloudinary
  const urlRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  const myCloud = await cloudinary.v2.uploader.upload(
    urlRegex.test(image) ? base64 : image,
    {
      folder: "krishan_bazar_clients",
    }
  );

  client = await ClientSay.findByIdAndUpdate(req.params.id, {
    name,
    designation,
    description,
    image: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Client Updated successfully",
    client,
  });
});
