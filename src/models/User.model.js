const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		name: String,
		userType: { type: String, default: "Buyer" },
		email: { type: String, unique: true },
		password: String,
		phone_number: String,
		wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
