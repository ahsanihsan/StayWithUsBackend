const product = require("../controllers/product.controller.js");

const multer = require("multer");
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});
const JWT = require("../helper/jsonwebtoken");

module.exports = (app) => {
  // Create a new product
  app.post(
    "/product",
    JWT.checkToken,
    multerMid.array("images"),
    product.create
  );
  // Retrieve all product
  app.get("/product", product.findAll);
  // Retrieve featured products
  app.get("/product/featured", product.findFeaturedProducts);
  // Retrieve users products
  app.get("/product/user/:userId", JWT.checkToken, product.findUserProducts);
  // Retrieve single product using its id
  app.get("/product/:productId", product.findOne);
  // Retrieve single product using its id
  app.post("/product/query", product.queryProducts);
  // Delete a single product using its id
  app.delete("/product/:productId", JWT.checkToken, product.delete);
};
