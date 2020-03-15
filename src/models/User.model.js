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
    profile_pictrue: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
