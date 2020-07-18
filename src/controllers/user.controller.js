const User = require("../models/User.model.js");
const helper = require("../helper/passwords");
const { sendEmail } = require("./mailer.js");
const { handlePushTokens } = require("../helper/pushNotifications");

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

exports.update = (req, res) => {
	User.findByIdAndUpdate(req.params.userId, req.body)
		.then((data) => {
			User.findById(req.params.userId)
				.then((response) => {
					res.send({
						success: true,
						message: response,
					});
				})
				.catch((err) => {
					res.status(500).send({
						message:
							err.message ||
							"Some error occurred while fetching the data for you.",
					});
				});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

exports.addToWishList = (req, res) => {
	User.findById(req.body.user)
		.then((data) => {
			if (data.wishList.includes(req.body.property)) {
				let index = data.wishList.findIndex((item) => {
					return item === req.body.property;
				});
				data.wishList.splice(index, 1);
			} else {
				data.wishList.push(req.body.property);
			}
			data
				.save()
				.then(() => {
					res.send({
						success: true,
					});
				})
				.catch((error) => {
					res.send({
						success: false,
					});
				});
		})
		.catch((err) => {
			res.status(500).send({
				success: false,
			});
		});
};

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

exports.findAll = (req, res) => {
	User.find({})
		.then((data) => {
			res.send({
				success: true,
				message: data,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

exports.setRating = (req, res) => {
	User.findById(req.params.userId)
		.then((data) => {
			if (data) {
				if (data.rating && data.rating.length > 0) {
					let index = data.rating.findIndex(
						(item) => item.userId === req.body.user
					);
					if (index != -1) {
						data.rating[index].rating = req.body.rating;
						data.rating[index].ratingText = req.body.ratingText;
					} else {
						data.rating.push({
							rating: req.body.rating,
							userId: req.body.user,
							ratingText: req.body.ratingText,
						});
					}
				} else {
					data.rating.push({
						rating: req.body.rating,
						userId: req.body.user,
						ratingText: req.body.ratingText,
					});
				}
				data.markModified("rating");
				data
					.save()
					.then((response) => {
						return res.send({
							success: true,
							message: response,
						});
					})
					.catch((error) => {
						return res.send({
							success: false,
							message: data,
						});
					});
			} else {
				return res.send({
					success: false,
					message: false,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

exports.findOne = (req, res) => {
	User.findById(req.params.id)
		.then((data) => {
			res.send({
				success: true,
				message: data,
			});
		})
		.catch((err) => {
			res.send({
				message: "Some error occurred while fetching the data for you.",
				success: false,
			});
		});
};

exports.deactivateAccount = (req, res) => {
	User.findById(req.params.id)
		.then((data) => {
			data.active = false;
			data
				.save()
				.then((response) => {
					res.send({
						success: true,
						message: "Your account has been de activated successfully",
					});
				})
				.catch((error) => {
					res.send({
						success: true,
						message:
							"There was a problem de activating your account. Please try again later.",
					});
				});
		})
		.catch((err) => {
			res.send({
				message: "Some error occurred while fetching the data for you.",
				success: false,
			});
		});
};

exports.wishList = (req, res) => {
	User.findById(req.params.id)
		.populate("wishList")
		.then((data) => {
			res.status(200).send({
				message: data.wishList,
				success: true,
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

exports.userVerify = (req, res) => {
	User.find({ email: req.body.email }).then((data) => {
		if (data && data.length > 0) {
			if (data[0].passwordResetCode === req.body.resetCode) {
				res.status(200).send({
					message: "Please enter new password to reset",
					success: true,
				});
			} else {
				res.status(200).send({
					message: "Reset code you entered is not correct.",
					success: false,
				});
			}
		} else {
			res.status(200).send({
				message: "Reset code you entered is not correct.",
				success: false,
			});
		}
	});
};

exports.changePassword = (req, res) => {
	User.find({ email: req.body.email }).then(async (data) => {
		if (data && data.length > 0) {
			let user = data[0];
			let hashPassword = await helper.encryptPassword(req.body.newPassword);
			if (hashPassword) {
				user.password = hashPassword;
				user
					.save()
					.then((data) => {
						res.send({
							success: true,
							message: "Your password has been changed successfuly",
						});
					})
					.catch((err) => {
						res.send({
							message:
								err.message ||
								"Some error occurred while changing your password.",
							message: false,
						});
					});
			} else {
				res.send({
					message:
						err.message || "Some error occurred while changing your password.",
					message: false,
				});
			}
		}
	});
};

exports.sendPushNotification = (req, res) => {
	let title = req.body.title;
	let body = req.body.body;
	let token = req.body.token;
	handlePushTokens(title, body, token);
	return res.send({
		success: true,
		message: "Notification sent",
	});
};

exports.requestResetPassword = (req, res) => {
	User.find({ email: req.body.email })
		.then((data) => {
			if (data && data.length > 0) {
				let randomNumber = Math.floor(Math.random() * 90000) + 10000;
				let user = data[0];
				user.passwordResetCode = randomNumber;

				user
					.save()
					.then(async (responseUpper) => {
						let emailResponse = await sendEmail(user.email, randomNumber);
						if (emailResponse) {
							res.status(200).send({
								message:
									"An email has been sent to your account. Please check your inbox and enter your 5 digits code to reset your password.",
								success: true,
							});
						} else {
							res.status(200).send({
								message:
									"There was a problem sending you an email. Please contact the administrator",
								success: false,
							});
						}
					})
					.catch((error) => {
						res.status(200).send({
							message: "Email you entered does not belong to any account.",
							success: false,
						});
					});
			} else {
				res.status(200).send({
					message: "Email you entered does not belong to any account.",
					success: false,
				});
			}
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};
