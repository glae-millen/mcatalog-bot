//ping.js
exports.run = (client, message, args) => {
	const embed = new client.Discord.RichEmbed();

	embed
		.setColor('DARK_VIVID_PINK')
		.setTitle(`:ping_pong: **Pong!** Ping is ` + `__` + Math.round(client.ping) + `__ ms.`)
	message.channel.send(embed).catch(console.error);
}
