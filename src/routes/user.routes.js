module.exports = (app) => {
	const user = require("../controllers/user.controller.js");
	const auth = require("../controllers/auth.controller.js");
	const JWT = require("../helper/jsonwebtoken");

	app.post("/users", user.create);
	app.post("/login", auth.login);
	app.put("/users/:userId", user.update);
	app.get("/users", user.findAll);
	app.get("/users/:id", user.findOne);
	app.get("/users/deactivate/:id", user.deactivateAccount);
	app.post("/users/wishlist", user.addToWishList);
	app.get("/users/wishlist/:id", user.wishList);
	app.post("/users/reset", user.requestResetPassword);
	app.post("/users/verify", user.userVerify);
	app.post("/users/change-password", user.changePassword);
};
