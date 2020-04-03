module.exports = (app) => {
  const product = require("../controllers/product.controller.js");

  // Create a new review
  app.post("/product", product.create);

  // Retrieve all product
  app.get("/product", product.findAll);
};
