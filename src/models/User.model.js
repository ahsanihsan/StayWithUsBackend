const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		name: String,
		userType: { type: String, default: "Buyer" },
		email: { type: String, unique: true },
		password: String,
		phone_number: String,
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
