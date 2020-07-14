const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		name: String,
		userType: { type: String, default: "Buyer" },
		email: { type: String, unique: true },
		pushNotificationToken: { type: String },
		password: String,
		phone_number: String,
		passwordResetCode: String,
		active: { type: Boolean, default: true },
		wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Property" }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
