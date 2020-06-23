// ping.js
exports.run = (client, message, args) =>
{
  // Initalize Discord embed and required variables
	const embed = new client.Discord.MessageEmbed();
  const ping = Date.now() - message.createdTimestamp;
  var color = client.handler.colorize(client);
  
  // Build the embed
	embed
		.setColor(`${color}`)
		.setTitle(`:ping_pong: **Pong!** Ping is __${Math.round(ping)}__ ms.`)
	message.channel.send(embed).catch(console.error);
}