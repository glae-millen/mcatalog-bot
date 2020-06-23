// ready.js
module.exports = (client, ready) =>
{
	console.log(`MCatalog Bot v. ${client.config.version} -- Username: ${client.user.username}`);
  console.log(`Currently serving ${client.guilds.cache.size} servers and ${client.users.cache.size} members`);
	client.user.setActivity(`a sound no one has ever heard`, {type:"PLAYING"});
}