const Property = require("../models/Property.model.js");
const Booking = require("../models/Booking.model.js");
var moment = require("moment");

exports.create = async (req, res) => {
	let allImages = req.body.images;

	let property = new Property(req.body);

	allImages.map((item, index) => {
		if (item) {
			var base64Data = item.replace(/^data:image\/png;base64,/, "");

			require("fs").writeFile(
				"src/images/" + property._id + "_" + index + ".jpg",
				base64Data,
				"base64",
				function (err) {
					console.log(err);
				}
			);
			property.images[index] = property._id + "_" + index + ".jpg";
		}
	});

	property
		.save()
		.then((response) => {
			res.status(200).send({
				success: true,
				message: "Your property has been created",
			});
		})
		.catch((error) => {
			res.status(500).send({
				success: false,
				message: "Some error occurred while signing you up.",
			});
		});
};

exports.findSellerProperties = (req, res) => {
	Property.find({ seller: req.params.id })
		.populate("seller")
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

exports.findAll = (req, res) => {
	Property.find()
		.populate("seller")
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

exports.findOne = (req, res) => {
	Property.findById(req.params.id)
		.populate("seller")
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
	Property.findById(req.body.property)
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

exports.update = (req, res) => {
	Property.findByIdAndUpdate(req.params.id, req.body)
		.then((data) => {
			res.send({
				success: true,
				message: "Property updated successfully",
			});
		})
		.catch((err) => {
			res.status(200).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

exports.delete = (req, res) => {
	Property.findByIdAndDelete(req.params.id)
		.then((data) => {
			res.send({
				success: true,
				message: "Property deleted successfully",
			});
		})
		.catch((err) => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while fetching the data for you.",
			});
		});
};

exports.bookApartment = (req, res) => {
	// Property.findById(req.params.id)
	// 	.then((data) => {

	// 	})
	// 	.catch((err) => {
	// 		res.status(500).send({
	// 			message:
	// 				err.message || "Some error occurred while fetching the data for you.",
	// 		});
	// 	});
	Booking.find({})
		.then((response) => {
			let property = req.body.property;
			let propertyBookings = [];

			let newBookingCheckIn = req.body.checkInDate;
			let newBookingCheckOut = req.body.checkOutDate;

			response.map((item) => {
				if (item.property == property) {
					propertyBookings.push(item);
				}
			});

			let available = false;
			console.log(propertyBookings.length);
			for (var i = 0; i < propertyBookings.length; i++) {
				let Date_1 = moment(propertyBookings[i].checkInDate);
				let Date_2 = moment(propertyBookings[i].checkOutDate);

				let Date_to_check = moment(newBookingCheckIn);

				// let D_1 = Date_1.split("-");
				// let D_2 = Date_2.split("-");
				// let D_3 = Date_to_check.split("-");

				// var d1 = new Date(D_1[2], parseInt(D_1[1]) - 1, D_1[0]);
				// var d2 = new Date(D_2[2], parseInt(D_2[1]) - 1, D_2[0]);
				// var d3 = new Date(D_3[2], parseInt(D_3[1]) - 1, D_3[0]);
				// console.log("***** HMMMM *****");
				// console.log("******* d1 ", d1);
				// console.log("******* d2 ", d2);
				// console.log("******* d3 ", d3);
				// console.log("***** HMMMM *****");

				if (Date_to_check < Date_2 && Date_to_check > Date_1) {
					available = false;
					break;
				} else {
					available = true;
				}
			}
			if (available) {
				let newBooking = new Booking(req.body);
				newBooking
					.save()
					.then((bookingRes) => {
						res.send({
							message:
								"Your request has been succesfully submitted, please wait for your approval",
							success: true,
						});
					})
					.catch((error) => {
						res.send({
							message:
								err.message ||
								"Some error occurred while fetching the data for you.",
							success: false,
						});
					});
			} else {
				res.send({
					message:
						"Apartment is already booked on the date you are trying to book on.",
					success: false,
				});
			}
		})
		.catch((error) => {
			res.send({
				message:
					error.message ||
					"Some error occurred while fetching the data for you.",

				success: false,
			});
		});
};
