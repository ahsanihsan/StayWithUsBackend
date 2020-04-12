const product = require("../controllers/product.controller.js");

const multer = require("multer");
const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = (app) => {
  // Create a new product
  app.post("/product", multerMid.array("images"), product.create);
  // Retrieve all product
  app.get("/product", product.findAll);
  // Retrieve featured products
  app.get("/product/featured", product.findFeaturedProducts);
  // Retrieve single product using its id
  app.get("/product/:productId", product.findOne);
};
