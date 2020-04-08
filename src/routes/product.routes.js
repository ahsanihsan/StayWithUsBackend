const multer = require("multer");

module.exports = (app) => {
  const product = require("../controllers/product.controller.js");

  const multerMid = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  // Create a new review
  app.post("/product", multerMid.array("images"), product.create);

  // Retrieve all product
  app.get("/product", product.findAll);
};
