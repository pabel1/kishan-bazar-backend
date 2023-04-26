// external import
const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitor: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Visitor = mongoose.model("Visitor", visitorSchema);
module.exports = Visitor;
