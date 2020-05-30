module.exports = (app) => {
	const user = require("../controllers/user.controller.js");
	const auth = require("../controllers/auth.controller.js");
	const JWT = require("../helper/jsonwebtoken");

	// Create a new user
	app.post("/users", user.create);

	// Login a user
	app.post("/login", auth.login);

	// Retrieve all users
	app.get("/users", user.findAll);

	// Retrieve a single user with userId
	app.get("/users/:userId", user.findOne);

	// Update a user with userId
	app.put("/users/:userId", JWT.checkToken, user.update);

	// Update a user with userId
	app.put("/users/email/:userId", JWT.checkToken, user.updateEmail);

	// Update a user with userId
	app.put("/users/password/:userId", JWT.checkToken, user.updatePassword);

	// Update a user with userId
	app.put("/users/token/:userId", user.updateToken);

	// Delete a user with userId
	app.delete("/users/:userId", JWT.checkToken, user.delete);

	// Delete a user with userId
	app.get("/report/:userId", JWT.checkToken, user.userReport);
};
