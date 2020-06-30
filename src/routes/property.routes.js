const property = require("../controllers/property.controller.js");

module.exports = (app) => {
	app.post("/property", property.create);
	app.post("/property/rate", property.setRating);
	app.post("/property/booking", property.bookApartment);
	app.post(
		"/property/booking/change/:bookingId",
		property.changeBookingRequest
	);
	app.get("/property/booked/:sellerId", property.bookingRequestsApproved);
	app.get("/property/booking/:sellerId", property.bookingRequests);
	app.get("/property", property.findAll);
	app.get("/property/seller/:id", property.findSellerProperties);
	app.get("/property/:id", property.findOne);
	app.put("/property/:id", property.update);
	app.put("/property/cancel/:bookingId", property.cancelOrder);
	app.delete("/property/:id", property.delete);
};
