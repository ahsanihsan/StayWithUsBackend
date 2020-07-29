const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const jsonWebToken = require("./src/helper/jsonwebtoken");

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

// bodyParser = {
// 	json: { limit: "50mb", extended: true },
// 	urlencoded: { limit: "50mb", extended: true },
// };

// app.get("/", jsonWebToken.checkToken, (req, res) => {
// 	res.json({
// 		success: true,
// 		message: "Index page",
// 	});
// });

app.use(express.static(__dirname + "/src/images"));

// Routes
require("./src/routes/user.routes.js")(app);
require("./src/routes/property.routes.js")(app);

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
