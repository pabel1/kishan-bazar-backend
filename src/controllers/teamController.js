const catchAsyncError = require("../middlewares/catchAsyncError");
const Errorhandeler = require("../utility/ErrorHandler");
const cloudinary = require("cloudinary");

const Team = require("../models/TeamModel");

// creating a team member
exports.createTeam = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image } = req.body;
  if (!name || !designation || !description || !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  const myCloud = await cloudinary.v2.uploader.upload(image, {
    folder: "krishan_bazar_teams",
    width: 150,
    crop: "scale",
  });

  const team = await Team.create({
    name,
    designation,
    description,
    image: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });
  res.status(201).json({
    success: true,
    message: "Team Created Successfully",
    team,
  });
});

// get all team member
exports.getAllTeamMembers = catchAsyncError(async (req, res, next) => {
  const teams = await Team.find().sort({ createdAt: -1 });
  if (!teams) {
    return next(new Errorhandeler("No team member found", 404));
  }
  res.status(200).json({
    success: true,
    teams,
  });
});

// update a team member
exports.updateTeamMember = catchAsyncError(async (req, res, next) => {
  const { name, designation, description, image, base64 } = req.body;
  if (!name && !designation && !description && !image) {
    return next(new Errorhandeler("Please enter the value first", 400));
  }
  let team = await Team.findById(req.params.id);
  if (!team) {
    return next(new Errorhandeler("Team member is not found", 404));
  }

  // Removing image from cloudinary
  await cloudinary.v2.uploader.destroy(team?.image?.public_id);

  // Adding updated image to cloudinary
  const urlRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  const myCloud = await cloudinary.v2.uploader.upload(
    urlRegex.test(image) ? base64 : image,
    {
      folder: "krishan_bazar_teams",
      width: 150,
      crop: "scale",
    }
  );

  team = await Team.findByIdAndUpdate(req.params.id, {
    name,
    designation,
    description,
    image: { public_id: myCloud.public_id, url: myCloud.secure_url },
  });
  res.status(200).json({
    success: true,
    message: "Team Member Updated successfully",
    team,
  });
});

// delete a team member
exports.deleteTeamMember = catchAsyncError(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return next(new Errorhandeler("Team member is not found", 404));
  }
  // Removing image from cloudinary
  await cloudinary.v2.uploader.destroy(team?.image?.public_id);
  await team.remove();
  res.status(200).json({
    success: true,
    message: "Team Member deleted successfully",
    team,
  });
});
