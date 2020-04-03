const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    images: [String],
    condition: Number,
    price: Number,
    storyRating: Number,
    views: Number,
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isSold: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
