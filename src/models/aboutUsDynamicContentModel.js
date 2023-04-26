const mongoose = require("mongoose");

const aboutUs = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter Title"],
      trim: true,
    },
    subHeader: {
      type: String,
      required: [true, "Please enter Header"],
      trim: true,
    },
    groupphoto: {
      type: String,
      required: [true, "Please enter  Group Image"],
    },
    groupphotosecond: {
      type: String,
      required: [true, "Please enter  Group Image"],
    },
    description: {
      type: String,
      required: [true, "Please enter client description"],
      trim: true,
    },
    bgimage: {
      type: String,
      required: [true, "Please select Backgraound image"],
      trim: true,
    },
  },
  { timestamps: true }
);

const AboutUs = mongoose.model("AboutContent", aboutUs);
module.exports = AboutUs;
