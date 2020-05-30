const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
	{
		name: String,
		psn: String,
		userType: { type: String, default: "User" },
		email: { type: String, unique: true },
		password: String,
		phone_number: String,
		expoToken: String,
		isBlackList: { type: Boolean, default: false },
		seller_level: { type: Number, default: 1 },
		profile_picture: {
			type: String,
			default:
				"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200",
		},
		reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
		addresses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("User", UserSchema);
