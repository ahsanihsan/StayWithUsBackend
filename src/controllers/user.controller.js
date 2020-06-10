const User = require("../models/User.model.js");
const helper = require("../helper/passwords");

// Create and Save a new user
exports.create = async (req, res) => {
	User.find({ email: req.body.email }).then(async (userRecord) => {
		if (userRecord && userRecord.length > 0) {
			res.status(200).send({
				success: false,
				message:
					"You are already registered with us! Please try resetting your password or try with a new email.",
			});
		} else {
			let hashPassword = await helper.encryptPassword(req.body.password);
			if (hashPassword) {
				req.body.password = hashPassword;
				let user = new User(req.body);
				user
					.save()
					.then((data) => {
						res.send({
							success: true,
							message: "You have been registered with us successfuly",
						});
					})
					.catch((err) => {
						res.status(500).send({
							message:
								err.message || "Some error occurred while signing you up.",
						});
					});
			} else {
				res.status(500).send({
					success: false,
					message: "Some error occurred while signing you up.",
				});
			}
		}
	});
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
	User.findByIdAndUpdate(req.params.userId, req.body)
		.then((data) => {
			res.send({
				success: true,
				message: "User updated successfully",
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
	User.findByIdAndDelete(req.params.userId)
		.then((data) => {
			res.send({
				success: true,
				message: "User deleted successfully",
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};
