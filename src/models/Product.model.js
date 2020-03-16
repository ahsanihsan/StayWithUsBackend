const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: Number,
    comment: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Review", ReviewSchema, "reviews");
