//help.js
exports.run = (client, message, args) => {
	const embed = new client.Discord.RichEmbed();

	embed
		.setColor('DARK_VIVID_PINK')
		.addField(`MCatalog Bot v${client.config.version}`, `**Prefix**: ${client.config.prefix}`)
		.addField("_ _", "_ _")
		.addField("Command list", "Below are a list of commands that are executable using this bot.")
		.addField("`help`", "Shows an extensive list of executable commands.")
		.addField("`info`", "Shows information regarding a Monstercat track.\n`Syntax: c.info <search_term>`")
		.addField("`ping`", "Tests the bot's response time.")
    .addField("`uptime`", "Shows how long the bot has been online.")
	message.channel.send(embed).catch(console.error);
}
