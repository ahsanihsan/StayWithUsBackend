const property = require("../controllers/property.controller.js");

module.exports = (app) => {
	app.post("/property", property.create);
	app.get("/property", property.findAll);
	app.get("/property/:id", property.findOne);
	app.put("/property/:id", property.update);
	app.delete("/property/:id", property.delete);
};
