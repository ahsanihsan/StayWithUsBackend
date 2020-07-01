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
			let properties = [];
			data.forEach((item) => {
				if (item.seller.active) {
					properties.push(item);
				}
			});
			res.send({
				success: true,
				message: properties,
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
	Booking.find({})
		.then((response) => {
			let property = req.body.property;
			let propertyBookings = [];

			let newBookingCheckIn = req.body.checkInDate;

			response.map((item) => {
				if (item.property == property && !item.cancelled) {
					propertyBookings.push(item);
				}
			});

			let available = false;
			if (propertyBookings.length > 0) {
				for (var i = 0; i < propertyBookings.length; i++) {
					let checkIn = moment(propertyBookings[i].checkInDate);
					let checkOut = moment(propertyBookings[i].checkOutDate);
					let newCheckIn = moment(newBookingCheckIn);

					if (newCheckIn >= checkIn && newCheckIn <= checkOut) {
						available = false;
						break;
					} else {
						available = true;
					}
				}
			} else {
				available = true;
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
						"Apartment is already booked on the date you are trying to book on. Please change your date.",
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

exports.bookingRequests = (req, res) => {
	Booking.find()
		.then((response) => {
			let seller = req.params.sellerId;
			let properties = [];
			response.forEach((item) => {
				if (
					item.seller == seller &&
					!item.approved &&
					!item.rejected &&
					!item.cancelled
				) {
					properties.push(item);
				}
			});
			res.send({
				message: properties,
				success: true,
			});
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

exports.bookingRequestsBuyer = (req, res) => {
	Booking.find()
		.then((response) => {
			let buyer = req.params.buyerId;
			let properties = [];
			response.forEach((item) => {
				if (
					item.buyer == buyer &&
					!item.approved &&
					!item.rejected &&
					!item.cancelled
				) {
					properties.push(item);
				}
			});
			res.send({
				message: properties,
				success: true,
			});
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

exports.bookingRequestsApproved = (req, res) => {
	Booking.find()
		.then((response) => {
			let seller = req.params.sellerId;
			let properties = [];
			response.forEach((item) => {
				if (item.seller == seller && item.approved && !item.cancelled) {
					properties.push(item);
				}
			});
			res.send({
				message: properties,
				success: true,
			});
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

exports.bookingRequestsApprovedBuyer = (req, res) => {
	Booking.find()
		.then((response) => {
			let buyer = req.params.buyerId;
			let properties = [];
			response.forEach((item) => {
				if (item.buyer == buyer && item.approved && !item.cancelled) {
					properties.push(item);
				}
			});
			res.send({
				message: properties,
				success: true,
			});
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

exports.cancelOrder = (req, res) => {
	Booking.findById(req.params.bookingId)
		.then((response) => {
			response.cancelled = true;
			response
				.save()
				.then((respsoososo) => {
					res.send({
						message: "Your order has been cancelled",
						success: true,
					});
				})
				.catch((erororor) => {
					res.send({
						message:
							"There was a problem cancelling your request. Please try again later.",
						success: false,
					});
				});
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

exports.changeBookingRequest = (req, res) => {
	let bookingId = req.params.bookingId;
	let requestedChange = req.body.change;
	if (requestedChange === "declined") {
		Booking.findByIdAndDelete(bookingId)
			.then((response) => {
				res.send({
					message: "Requested changes have been made.",
					success: true,
				});
			})
			.catch((error) => {
				res.send({
					message:
						error.message ||
						"Some error occurred while fetching the data for you.",
					success: false,
				});
			});
	} else {
		Booking.findById(bookingId)
			.then((response) => {
				if (requestedChange === "approved") {
					response.approved = true;
				} else {
					response.rejected = true;
				}
				response
					.save()
					.then((ressss) => {
						res.send({
							message: "Requested changes have been made.",
							success: true,
						});
					})
					.catch((error) => {
						res.send({
							message: "Unable to change the data",
							success: false,
						});
					});
			})
			.catch((error) => {
				res.send({
					message:
						error.message ||
						"Some error occurred while fetching the data for you.",
					success: false,
				});
			});
	}
};
