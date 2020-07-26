const mongoose = require("mongoose");

const PropertySchema = mongoose.Schema(
	{
		name: String,
		description: String,
		address: String,
		images: [String],
		breakfastImages: [String],
		lunchImages: [String],
		dinnerImages: [String],
		vehicleImages: [String],
		vehicle: { type: Boolean, default: false },
		area: Number,
		bedroom: Number,
		kitchen: Number,
		bathroom: Number,
		rent: Number,
		longitude: Number,
		latitude: Number,
		carParking: { type: Boolean, default: false },
		meals: { type: Boolean, default: false },
		breakfastCost: { type: Number, default: 0 },
		lunchCost: { type: Number, default: 0 },
		dinnerCost: { type: Number, default: 0 },
		securityFee: { type: Boolean, default: false },
		rating: { type: mongoose.Schema.Types.Mixed, default: [] },
		seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Property", PropertySchema);
