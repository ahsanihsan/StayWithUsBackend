module.exports = (app) => {
  const review = require("../controllers/reviews.controller.js");
  const JWT = require("../helper/jsonwebtoken");

  // Create a new review
  app.post("/reviews", review.create);

  // Retrieve all reviews
  app.get("/reviews", JWT.checkToken, review.findAll);

  // // Retrieve a single user with userId
  // app.get("/users/:userId", user.findOne);

  // // Update a user with userId
  // app.put("/users/:userId", user.update);

  // // Delete a user with userId
  // app.delete("/users/:userId", user.delete);
};
