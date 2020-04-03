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
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
