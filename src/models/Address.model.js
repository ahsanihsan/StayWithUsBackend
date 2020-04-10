const mongoose = require("mongoose");

const AddressSchema = mongoose.Schema(
  {
    addressLine1: String,
    addressLine2: String,
    city: String,
    province: String,
    zipCode: Number,
    phoneNumber: String,
    emailAddress: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Adress", AddressSchema, "addresses");
