const Review = require("../models/Review.model.js");
const User = require("../models/User.model.js");
const Product = require("../models/Product.model.js");
require("../models/Address.model.js");

const Joi = require("@hapi/joi");
const uploadImage = require("../helper/fileUploader");

const productSchemaValidator = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  condition: Joi.number().required(),
  price: Joi.number().required(),
  storyRating: Joi.number().required(),
  seller: Joi.string().required(),
  isFeatured: Joi.boolean(),
  address: Joi.string().required(),
  images: Joi.array().required,
});

const productSeriaizedData = {
  path: "seller",
  select: { _id: 1, name: 1, psn: 1, createdAt: 1, profile_picture: 1 },
  populate: {
    path: "reviews",
    select: { _id: 1, createdAt: 1, comment: 1, rating: 1 },
    populate: {
      path: "author",
      select: { _id: 1, name: 1, psn: 1 },
    },
  },
};
const commentSerializedData = {
  path: "comments",
  select: { _id: 1, comment: 1, likes: 1, dislikes: 1, createdAt: 1 },
  populate: {
    path: "author",
    select: { _id: 1, name: 1 },
  },
};
const addressSerializedData = {
  path: "address",
  select: {
    _id: 1,
    addressLine1: 1,
    addressLine2: 1,
    city: 1,
    province: 1,
    zipCode: 1,
    phoneNumber: 1,
    emailAddress: 1,
  },
};

// Create and Save a new product
exports.create = async (req, res) => {
  const productData = JSON.parse(req.body.values);
  let response = productSchemaValidator.validate(productData);
  if (response && response.error) {
    return res.status(400).send(response.error);
  } else {
    let product = new Product(productData);
    let files = req.files;
    let promises = files.map(async (item, key) => {
      let name = product.id + "_" + key + ".jpeg";
      item.originalname = name;
      let imageUploading = await uploadImage(item);
      return imageUploading;
    });
    Promise.all(promises)
      .then((response) => {
        product.images = response;
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
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: error,
        });
      });
  }
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  Product.find()
    .populate(productSeriaizedData)
    .populate(addressSerializedData)
    .populate(commentSerializedData)
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

// Retrieve and return all users from the database.
exports.findUserProducts = (req, res) => {
  Product.find({ seller: req.params.userId })
    .populate(productSeriaizedData)
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

// Retrieve and return all products that satisfy the incoming query
exports.queryProducts = (req, res) => {
  let query = Object.keys(req.body).length > 0 ? req.body : false;
  if (query) {
    Product.find()
      .populate(productSeriaizedData)
      .populate(addressSerializedData)
      .then((data) => {
        let products = [];
        data.map((item) => {
          if (query.name && query.city) {
            if (
              item.name.includes(query.name) &&
              query.city === item.address.city
            ) {
              products.push(item);
            }
          } else if (query.name && !query.city) {
            if (item.name.includes(query.name)) {
              products.push(item);
            }
          } else if (!query.name && query.city) {
            if (query.city === item.address.city) {
              products.push(item);
            }
          } else if (!query.name && query.city) {
            products.push(item);
          }
        });
        res.send({
          success: true,
          message: products,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while fetching the data for you.",
        });
      });
  } else {
    Product.find()
      .populate(productSeriaizedData)
      .then((data) => {
        res.send({
          success: true,
          message: data,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while fetching the data for you.",
        });
      });
  }
};

exports.findFeaturedProducts = (req, res) => {
  Product.find({ isFeatured: true })
    .populate(productSeriaizedData)
    .populate(addressSerializedData)
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

// // Find a single product with a productId
exports.findOne = (req, res) => {
  Product.findById(req.params.productId)
    .populate(productSeriaizedData)
    .populate(addressSerializedData)
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

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  Product.findByIdAndDelete(req.params.productId)
    .then((data) => {
      res.send({
        success: true,
        message: "Product deleted successfully",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while fetching the data for you.",
      });
    });
};
