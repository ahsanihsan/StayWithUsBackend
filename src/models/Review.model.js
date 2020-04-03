const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    rating: Number,
    comment: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Review", ReviewSchema, "reviews");
