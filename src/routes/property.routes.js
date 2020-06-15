const property = require("../controllers/property.controller.js");

module.exports = (app) => {
	app.post("/property", property.create);
	app.post("/property/rate", property.setRating);
	app.get("/property", property.findAll);
	app.get("/property/seller/:id", property.findSellerProperties);
	app.get("/property/:id", property.findOne);
	app.put("/property/:id", property.update);
	app.delete("/property/:id", property.delete);
};
