var jwt = require("jsonwebtoken");
const configs = require("../configs/config");

exports.generateJWT = data => {
  var token = jwt.sign(
    {
      data
    },
    configs.PRIVATE_KEY,
    { expiresIn: configs.EXPIRY_TIME }
  );
  return token;
};

exports.decodeJWT = token => {
  var token = jwt.decode(token);
  return token;
};
