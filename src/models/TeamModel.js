const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter client name"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Please enter client designation"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please enter client description"],
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
