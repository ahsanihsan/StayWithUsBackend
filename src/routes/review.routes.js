module.exports = app => {
  const review = require("../controllers/reviews.controller.js");

  // Create a new user
  app.post("/reviews", review.create);

  // // Login a user
  // app.post("/login", auth.login);

  // Retrieve all reviews
  app.get("/reviews", review.findAll);

  // // Retrieve a single user with userId
  // app.get("/users/:userId", user.findOne);

  // // Update a user with userId
  // app.put("/users/:userId", user.update);

  // // Delete a user with userId
  // app.delete("/users/:userId", user.delete);
};
