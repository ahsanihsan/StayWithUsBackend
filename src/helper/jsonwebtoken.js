var jwt = require("jsonwebtoken");
const configs = require("../configs/config");

exports.generateJWT = (data) => {
  var token = jwt.sign(
    {
      data,
    },
    configs.PRIVATE_KEY,
    { expiresIn: configs.EXPIRY_TIME }
  );
  return token;
};

exports.decodeJWT = (token) => {
  var token = jwt.decode(token);
  return token;
};

exports.checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token) {
    if (token && token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, configs.PRIVATE_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Token is not valid",
        });
      } else {
        req.current_user = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: "Auth token is not supplied",
    });
  }
};
