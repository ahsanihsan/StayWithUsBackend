const Address = require("../models/Address.model.js");
const User = require("../models/User.model.js");

const Joi = require("@hapi/joi");

const addressSchema = Joi.object({
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string(),
  city: Joi.string().required(),
  province: Joi.string().required(),
  zipCode: Joi.number().required(),
  phoneNumber: Joi.string().required(),
  emailAddress: Joi.string().required(),
  user: Joi.string().required(),
  longitude: Joi.number(),
  latitude: Joi.number(),
});

// Create and Save a new user
exports.create = async (req, res) => {
  let response = addressSchema.validate(req.body);
  if (response && response.error) {
    return res.status(400).send(response.error);
  } else {
    let address = new Address(req.body);
    address
      .save()
      .then((response) => {
        User.findById(req.body.user)
          .then((record) => {
            if (record) {
              if (record.addresses.length < 3) {
                record.addresses.push(address._id);
                record
                  .save()
                  .then((saved) => {
                    res.status(200).send({
                      success: true,
                      message: "Your address has been recorded.",
                    });
                  })
                  .catch((err) => {
                    res.status(500).send({
                      success: false,
                      message: "Some error occurred while adding your address.",
                    });
                  });
              } else {
                res.status(200).send({
                  success: false,
                  message: "You are not allowed to add more than 3 addresses.",
                });
              }
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
              message: "Some error occurred while adding your address.",
            });
          });
      })
      .catch((error) => {
        res.status(500).send({
          success: false,
          message: "Some error occurred while adding your address.",
        });
      });
  }
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  Address.find({ user: req.params.userId })
    // .populate("user author")
    .then((data) => {
      res.send({
        success: data && data.length > 0 ? true : false,
        message:
          data && data.length > 0
            ? data
            : "There is no address added by this user.",
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
