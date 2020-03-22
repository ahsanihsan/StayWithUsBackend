const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: String,
    psn: String,
    email: { type: String, unique: true },
    password: String,
    phone_number: String,
    active_ads: { type: Number, default: 0 },
    total_ads: { type: Number, default: 0 },
    active: { type: Boolean, default: false },
    profile_pictrue: {
      type: String,
      default:
        "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200"
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
