const Review = require("../models/Review.model.js");
const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js");

const Joi = require("@hapi/joi");

const productSchemaValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  images: Joi.array().items(Joi.string()).required(),
  condition: Joi.number().required(),
  price: Joi.number().required(),
  storyRating: Joi.number().required(),
  seller: Joi.string().required(),
});

// Create and Save a new product
exports.create = async (req, res) => {
  let response = productSchemaValidator.validate(req.body);
  if (response && response.error) {
    return res.status(400).send(response.error);
  } else {
    let product = new Product(req.body);
    product
      .save()
      .then((response) => {
        res.status(200).send({
          success: true,
          message:
            "Your product has been submitted, please wait for it to be published and go live once approved.",
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
  Product.find()
    .populate({
      path: "seller",
      select: { _id: 1, name: 1, psn: 1, createdAt: 1, profile_pictrue: 1 },
      populate: {
        path: "reviews",
        select: { _id: 1, createdAt: 1, comment: 1, rating: 1 },
      },
    })
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
