const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: String,
    psn: String,
    email: String,
    password: String,
    phone_number: String,
    active_ads: Number,
    total_ads: Number,
    profile_pictrue: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
