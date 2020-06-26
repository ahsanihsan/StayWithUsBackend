var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
	host: "mail.ahsanihsan.com",
	port: 465,
	secure: true,
	auth: {
		user: "info@ahsanihsan.com",
		pass: "X!T)C]O}H=th",
	},
});

exports.sendEmail = async (userEmail, userCode) => {
	var mailOptions = {
		from: "admin@staywithus.com",
		to: userEmail,
		subject: "Password Reset Stay With Us",
		text:
			"You have requested to reset your password for stay with us! This is your 5 digits code " +
			userCode +
			" enter to reset your password.",
	};
	let mailer = await transporter.sendMail(mailOptions);
	if (mailer && !mailer.error) {
		return true;
	} else {
		return false;
	}
};
