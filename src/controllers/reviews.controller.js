const Review = require("../models/Review.model.js");
const User = require("../models/User.model.js");

const Joi = require("@hapi/joi");

const reviewSchema = Joi.object({
	rating: Joi.number().required(),
	comment: Joi.string().required(),
	author: Joi.string().required(),
	user: Joi.string().required(),
});

// Create and Save a new user
exports.create = async (req, res) => {
	let response = reviewSchema.validate(req.body);
	if (response && response.error) {
		return res.status(400).send(response.error);
	} else {
		let review = new Review(req.body);
		review
			.save()
			.then((response) => {
				User.findById(req.body.user)
					.then((record) => {
						if (record) {
							record.reviews.push(review._id);
							record
								.save()
								.then((saved) => {
									res.status(200).send({
										success: true,
										message: "Your review has been recorded. Thank you.",
									});
								})
								.catch((err) => {
									res.status(500).send({
										success: false,
										message:
											"Some error occurred while submitting your review.",
									});
								});
						} else {
							res.status(500).send({
								success: false,
								message:
									"The user that you are trying to access is no longer available.",
							});
						}
					})
					.catch((err) => {
						res.status(500).send({
							success: false,
							message: "Some error occurred while submitting your review.",
						});
					});
			})
			.catch((error) => {
				res.status(500).send({
					success: false,
					message: "Some error occurred while signing you up.",
				});
			});
	}
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
	Review.find()
		.populate("user author")
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

// // Find a single user with a userId
// exports.findOne = (req, res) => {
//   User.findById(req.params.userId)
//     .then(data => {
//       res.send({
//         success: true,
//         message: data
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while fetching the data for you."
//       });
//     });
// };

// // Update a user identified by the userId in the request
// exports.update = (req, res) => {
//   User.findByIdAndUpdate(req.params.userId, req.body)
//     .then(data => {
//       res.send({
//         success: true,
//         message: "User updated successfully"
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while fetching the data for you."
//       });
//     });
// };

// // Delete a user with the specified userId in the request
// exports.delete = (req, res) => {
//   User.findByIdAndDelete(req.params.userId)
//     .then(data => {
//       res.send({
//         success: true,
//         message: "User deleted successfully"
//       });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while fetching the data for you."
//       });
//     });
// };
