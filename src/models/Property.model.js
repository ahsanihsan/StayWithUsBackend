const mongoose = require("mongoose");
const { any } = require("@hapi/joi");

const PropertySchema = mongoose.Schema(
	{
		name: String,
		description: String,
		address: String,
		area: Number,
		bedroom: Number,
		kitchen: Number,
		bathroom: Number,
		rent: Number,
		rating: { type: mongoose.Schema.Types.Mixed, default: [] },
		seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Property", PropertySchema);
