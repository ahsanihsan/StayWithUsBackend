const Property = require("../models/Property.model.js");

exports.create = async (req, res) => {
	var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

	let property = new Property(req.body);
	require("fs").writeFile(
		"src/images/" + property._id + ".jpg",
		base64Data,
		"base64",
		function (err) {
			console.log(err);
		}
	);
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
