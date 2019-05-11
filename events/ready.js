//ready.js
module.exports = (client, ready) =>
{
	console.log(`MCatalog Bot v. ${client.config.version} -- Username: ${client.user.username}`);
  console.log(`Currently serving ${client.guilds.size} servers and ${client.users.size} members`);
	client.user.setActivity(`Ah shit, here we go again *rhusma intensifies*`, {type: "PLAYING"});
}
