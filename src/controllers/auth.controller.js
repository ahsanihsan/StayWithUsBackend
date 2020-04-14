const User = require("../models/User.model.js");
const Joi = require("@hapi/joi");
const helper = require("../helper/passwords");
const jwt = require("../helper/jsonwebtoken");

const schema = Joi.object({
  email: Joi.string()
    .required()
    .error(new Error({ success: false, message: "Email is required " })),
  password: Joi.string().required(),
});

// Logs a user in
exports.login = async (req, res) => {
  let validRequest = schema.validate(req.body);
  if (validRequest && validRequest.error) {
    return res.status(400).send(validRequest.error);
  } else {
    const { email, password } = req.body;
    User.findOne({ email }).then(async (response) => {
      if (response) {
        let authorised = await helper.decryptPassword(
          password,
          response.password
        );
        if (authorised) {
          let token = jwt.generateJWT({
            active: response.active,
            _id: response._id,
            email: response.email,
            userType: response.userType,
          });
          return res.send({
            success: true,
            message: token,
            userId: response._id,
          });
        } else {
          return res.send({
            success: false,
            message: "Email or password you entered is not valid.",
          });
        }
      } else {
        return res.send({
          success: false,
          message: "There is no account associated with this email.",
        });
      }
    });
  }
};
