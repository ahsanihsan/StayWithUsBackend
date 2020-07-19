module.exports = (app) => {
	const user = require("../controllers/user.controller.js");
	const auth = require("../controllers/auth.controller.js");

	app.post("/users", user.create);
	app.post("/login", auth.login);
	app.put("/users/:userId", user.update);
	app.post("/users/rate/:userId", user.setRating);
	app.get("/users", user.findAll);
	app.get("/users/:id", user.findOne);
	app.get("/users/deactivate/:id", user.deactivateAccount);
	app.get("/users/deactivate/confirm/:id", user.checkDeactivation);
	app.post("/users/wishlist", user.addToWishList);
	app.get("/users/wishlist/:id", user.wishList);
	app.post("/users/reset", user.requestResetPassword);
	app.post("/users/verify", user.userVerify);
	app.post("/users/change-password", user.changePassword);
	app.post("/users/notification", user.sendPushNotification);
};
