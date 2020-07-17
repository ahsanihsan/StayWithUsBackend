const myExpo = require("expo-server-sdk");
const { Expo } = myExpo;

let expo = new Expo();

exports.handlePushTokens = (title, body, token) => {
	let notifications = [];
	if (!Expo.isExpoPushToken(token)) {
		console.error(`Push token ${token} is not a valid Expo push token`);
		return;
	}

	notifications.push({
		to: token,
		sound: "default",
		title: title,
		body: body,
	});

	let chunks = expo.chunkPushNotifications(notifications);

	(async () => {
		for (let chunk of chunks) {
			try {
				let receipts = await expo.sendPushNotificationsAsync(chunk);
				console.log(receipts);
			} catch (error) {
				console.error(error);
			}
		}
	})();
};
