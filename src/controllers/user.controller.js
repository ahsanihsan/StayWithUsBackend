const User = require("../models/User.model.js");
const Property = require("../models/Property.model.js");
const helper = require("../helper/passwords");

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

exports.wishList = (req, res) => {
	User.findById(req.params.id)
		.populate("wishList")
		.then((data) => {
			res.status(200).send({
				message: data.wishList,
				success: true,
			});
			// if(data.wishList.length > 0){
			// 	let properties = []
			// 	data.wishList.forEach(item => {
			// 		Property.findById(item => {
			// 			properties
			// 		})
			// 	})
			// 	res.send({
			// 		success: true,
			// 		message: []
			// 	});
			// }else{
			// 	res.send({
			// 		success: true,
			// 		message: []
			// 	});
			// }
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};
