const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.encryptPassword = async (password) => {
	let promisedData = await bcrypt
		.hash(password, saltRounds)
		.then((hash) => {
			return hash;
		})
		.catch((error) => {
			return false;
		});
	return promisedData;
};

exports.decryptPassword = async (password, hash) => {
	let passwordMatch = await bcrypt
		.compare(password, hash)
		.then((result) => {
			return result;
		})
		.catch((error) => {
			return false;
		});
	return passwordMatch;
};
