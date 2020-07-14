const User = require("../models/User.model.js");
const Joi = require("@hapi/joi");
const helper = require("../helper/passwords");
const jwt = require("../helper/jsonwebtoken");

// Logs a user in
exports.login = async (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).then(async (response) => {
		if (response) {
			let authorised = await helper.decryptPassword(
				password,
				response.password
			);
			if (authorised) {
				let token = jwt.generateJWT({
					isBlackList: response.isBlackList,
					_id: response._id,
					email: response.email,
					userType: response.userType,
				});
				response.active = true;
				response.pushNotificationToken = req.body.pushNotificationToken;
				response
					.save()
					.then(() => {
						return res.send({
							success: true,
							message: token,
							user: response,
						});
					})
					.catch((erroadfa) => {});
			} else {
				return res.send({
					success: false,
					message: "Email or password you entered is not valid.",
				});
			}
		} else {
			return res.send({
				success: false,
				message: "There is no account associated with this email.",
			});
		}
	});
};
