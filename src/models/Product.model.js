const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    name: String,
    description: String,
    images: [String],
    condition: Number,
    price: Number,
    storyRating: Number,
    views: { type: Number, default: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isSold: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
