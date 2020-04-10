module.exports = (app) => {
  const address = require("../controllers/address.controller.js");

  // Create a new review
  app.post("/address", address.create);

  // Retrieve all reviews
  app.get("/address/:userId", address.findAll);

  // // Retrieve a single user with userId
  // app.get("/users/:userId", user.findOne);

  // // Update a user with userId
  // app.put("/users/:userId", user.update);

  // // Delete a user with userId
  // app.delete("/users/:userId", user.delete);
};
