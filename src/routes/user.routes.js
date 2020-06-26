module.exports = (app) => {
	const user = require("../controllers/user.controller.js");
	const auth = require("../controllers/auth.controller.js");
	const JWT = require("../helper/jsonwebtoken");

	app.post("/users", user.create);
	app.post("/login", auth.login);
	app.put("/users/:userId", JWT.checkToken, user.update);
	app.get("/users", user.findAll);
	app.post("/users/wishlist", user.addToWishList);
	app.get("/users/wishlist/:id", user.wishList);
	app.post("/users/reset", user.requestResetPassword);
};
