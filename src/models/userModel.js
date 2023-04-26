// external import
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter user name"],
      trim: true,
      minlength: [4, "Name shuold be at least 4 character"],
    },
    email: {
      type: String,
      required: [true, "Please enter user email"],
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Invalid Email"],
    },
    phone: {
      type: String,
      length: [11, "Phone number must be 11 digits"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please enter user password"],
      minlength: [8, "Password should be at least 8 character"],
      trim: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please enter user confirm password"],
      minlength: [8, "Password should be at least 8 character"],
      trim: true,
      select: false,
    },
    avatar: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    avatarurl: String,
    userRole: {
      type: String,
      required: true,
    },
    referCode: {
      type: String,
      required: [true, "Please enter refer code"],
    },
    firebase: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// hashing password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
  }
  next();
});

// generating jwt token
userSchema.methods.getJWTtoken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generatinh reset password token
userSchema.methods.getResetPasswordToken = function () {
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
