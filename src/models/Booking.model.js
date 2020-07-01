const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema(
	{
		checkInDate: String,
		checkOutDate: String,
		rentCost: { type: Number, default: 0 },
		vehicleCost: { type: Number, default: 0 },
		breakfastCost: { type: Number, default: 0 },
		lunchCost: { type: Number, default: 0 },
		dinnerCost: { type: Number, default: 0 },
		misc: { type: Number, default: 0 },
		approved: { type: Boolean, default: false },
		rejected: { type: Boolean, default: false },
		cancelled: { type: Boolean, default: false },
		property: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
		buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
		seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Booking", BookingSchema);
