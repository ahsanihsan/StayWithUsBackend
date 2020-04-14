const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const jsonWebToken = require("./src/helper/jsonwebtoken");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", jsonWebToken.checkToken, (req, res) => {
  res.json({
    success: true,
    message: "Index page",
  });
});

// Routes
require("./src/routes/user.routes.js")(app);
require("./src/routes/review.routes.js")(app);
require("./src/routes/product.routes.js")(app);
require("./src/routes/address.routes.js")(app);

mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.listen(port, () => console.log(`Listening on port ${port}!`));
