// internal import
const { sendResetTokenToMail } = require("../mail/sendMail");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../utility/ErrorHandler");
const User = require("../models/userModel");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const { loginWithToken } = require("../utility/loginWithToken");

// signup user
exports.signupUser = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password, confirmPassword, avatar, firebase } =
    req.body;

  if (!name || !email || !password || !confirmPassword || !avatar) {
    return next(new ErrorHandler("Please fill the value properly", 400));
  }

  const userExist = await User.findOne({ email: email });
  if (userExist) {
    return loginWithToken(userExist, "Login Successfull!!", 200, res);
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password does not matched", 403));
  }
  const urlRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  if (urlRegex.test(avatar)) {
    req.body.avatarurl = avatar;
    req.body.firebase = firebase;
  }
  if (!urlRegex.test(avatar)) {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "krishan_bazar_users",
      width: 150,
      crop: "scale",
    });
    req.body.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }
  req.body.userRole = "User";
  req.body.referCode = Math.floor(Math.random() * 10000000000);

  const user = await User.create(req.body);

  //   saving token to cookie and sending response to client
  loginWithToken(user, "Signup Successfully!!", 201, res);
});

// login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please fill the value properly", 400));
  }
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  const isPasswordMatched = await user.comparePassword(password); // compare password with database hashed password
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Credential", 401));
  }
  loginWithToken(user, "Login Successfully!!", 200, res);
});

// logout user
exports.logoutUser = (req, res, next) => {
  res.cookie("logintoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
};

// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }
  const user = await User.findOne({ email: email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // Get Reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save();

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${resetToken}`;
  // const resetPasswordUrl = `http://localhost:3000/api/v1/user/password/reset/${resetToken}`;

  const message = `Your reset password link is ${resetPasswordUrl}`;
  const body = `<h3>Instructions : </h3> \n
    <p>Use the reset password link to reset your password , otherwise you can skip..</p> 
    ${message}
    `;

  try {
    await sendResetTokenToMail({
      email: user.email,
      subject: "Password Recovery",
      body: body,
    });
    res.status(200).json({
      messaage: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return next(new ErrorHandler(error.messaage, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { password, confirmPassword } = req.body;
  if (!password && !confirmPassword) {
    return next(new ErrorHandler("Please fill the value", 400));
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Please does not match", 403));
  }
  // Creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  console.log(user);
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired",
        400
      )
    );
  }
  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = password;
  user.confirmPassword = confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  loginWithToken(user, "Password Reset Successfully", 200, res);
});

// get login user details
exports.myDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({
    success: true,
    user: user,
  });
});

// update login user password
exports.updateMyPassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    return next(new ErrorHandler("Please fill the value properly", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  if (user.firebase === true) {
    return next(new ErrorHandler("Please Update Password in google", 400));
  }
  const isPasswordMatched = await user.comparePassword(oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is invalid", 401));
  }

  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  await user.save();
  loginWithToken(user, "Password Updated Successfully!!", 200, res);
});

// update login user profile
exports.updateMyProfile = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, avatar, base64 } = req.body;
  let user = await User.findById(req.user._id);
  if (user.firebase === true) {
    return next(
      new ErrorHandler("Please Update Profile in google or facebook", 400)
    );
  }
  if (!name && !email && !avatar) {
    return next(new ErrorHandler("Please fill the value properly", 400));
  }
  console.log(user?.avatar);
  // Removing image from cloudinary
  await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
  console.log("last");

  // Adding updated image to cloudinary
  const urlRegex =
    /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
  const myCloud = await cloudinary.v2.uploader.upload(
    urlRegex.test(avatar) ? base64 : avatar,
    {
      folder: "krishan_bazar_users",
      width: 150,
      crop: "scale",
    }
  );

  user = await User.findByIdAndUpdate(
    req.user._id,
    {
      name: name,
      email: email,
      phone: phone,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    user: user,
  });
});

// get all users (admin)

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  let pageno = Number(req.params.page) || 1;
  let perpage = Number(req.params.limit) || 10;

  let skipRow = (pageno - 1) * perpage;
  const users = await User.find().skip(skipRow).limit(perpage);
  const totalCount = await User.find().countDocuments();
  if (users.length === 0) {
    return next(new ErrorHandler("No user found", 400));
  }
  res.status(200).json({
    success: true,
    users,
    totalCount,
  });
});

// get single user (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorHandler(`User not found with this ${req.params.id}`));
  }
  res.status(200).json({
    success: true,
    user: user,
  });
});

// update use role (admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const { userRole } = req.body;
  if (!userRole) {
    return next(new ErrorHandler("User Role is required", 400));
  }
  const userExist = await User.findById(req.params.id);
  if (!userExist) {
    return next(
      new ErrorHandler(`User does not exist with this ${req.params.id}`)
    );
  }
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { userRole: userRole },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "User Role updated successfully",
    user: user,
  });
});

// delete user (admin)
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  // Removing image from cloudinary
  await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

  if (!user) {
    return next(new ErrorHandler(`User not found with this ${req.params.id}`));
  }
  await user.remove();
  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    user: user,
  });
});
