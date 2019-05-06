//ready.js
module.exports = (client, ready) => {
	console.log(`MCatalog Bot v. ${client.config.version} -- Username: ${client.user.username}`);
	client.user.setActivity(`FL > Ableton`, {type: "PLAYING"});
}
