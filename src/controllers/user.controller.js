const User = require("../models/User.model.js");
const helper = require("../helper/passwords");
const Joi = require("@hapi/joi");

const userSchema = Joi.object({
  name: Joi.string().required(),
  psn: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  phone_number: Joi.string().required(),
  active_ads: Joi.number(),
  total_ads: Joi.number(),
  profile_pictrue: Joi.string()
});

const reviewObjectSchema = {
  path: "reviews",
  select: { _id: 1, rating: 1, comment: 1, createdAt: 1 },
  populate: {
    path: "author",
    select: { _id: 1, name: 1 }
  }
};

// Create and Save a new user
exports.create = async (req, res) => {
  let response = userSchema.validate(req.body);
  if (response && response.error) {
    return res.status(400).send(response.error);
  } else {
    User.find({ email: req.body.email }).then(async userRecord => {
      if (userRecord && userRecord.length > 0) {
        res.status(500).send({
          success: true,
          message:
            "You are already registered with us! Please try resetting your password."
        });
      } else {
        let hashPassword = await helper.encryptPassword(req.body.password);
        if (hashPassword) {
          req.body.password = hashPassword;
          let user = new User(req.body);
          user
            .save()
            .then(data => {
              res.send({
                success: true,
                message: "You have been registered with us successfuly"
              });
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while signing you up."
              });
            });
        } else {
          res.status(500).send({
            success: false,
            message: "Some error occurred while signing you up."
          });
        }
      }
    });
  }
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find()
    .populate(reviewObjectSchema)
    .then(data => {
      res.send({
        success: true,
        message: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while fetching the data for you."
      });
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId)
    .populate(reviewObjectSchema)
    .then(data => {
      res.send({
        success: true,
        message: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while fetching the data for you."
      });
    });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  User.findByIdAndUpdate(req.params.userId, req.body)
    .then(data => {
      res.send({
        success: true,
        message: "User updated successfully"
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while fetching the data for you."
      });
    });
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndDelete(req.params.userId)
    .then(data => {
      res.send({
        success: true,
        message: "User deleted successfully"
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while fetching the data for you."
      });
    });
};
