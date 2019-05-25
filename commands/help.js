//help.js
exports.run = (client, message, args) =>
{
	const embed = new client.Discord.RichEmbed();
  var debugCmd = args.join(" ").toLowerCase();
  try
  {
    if (debugCmd === "crash me daddy") message.channel.send(embed.hahaUrGay("haha yes you are"));
    else if (debugCmd === "haha lul") return client.users.get("429655621076385795").send(`ur gay`);
	  embed
  		.setColor('DARK_VIVID_PINK')
  		.addField(`MCatalog Bot v${client.config.version}`, `**Prefix**: ${client.config.prefix}`)
  		.addBlankField()
  		.addField("Command list", "Below is a list of commands that are executable using this bot.")
  		.addField("`help`", "Shows an extensive list of executable commands.")
  		.addField("`info`", "Shows information regarding a Monstercat track.\n`Syntax: c.info <search_term>`\n**Note:** Add `remix/vip/remake` if you want the remix of a track.\nExample: `c.info fwlr anyway whales remix`")
  		.addField("`ping`", "Tests the bot's response time.")
      .addField("`uptime`", "Shows how long the bot has been online.")
      .addBlankField()
      .setThumbnail('https://cdn.discordapp.com/avatars/574846706647171092/e04f11164774389b05cc2ba42bdab465.jpg')
      .setFooter("This bot fetches data from https://rebrand.ly/mcatalog.")
  	message.channel.send(embed).catch(console.error);
  }
  catch (err)
  {
    message.channel.send(`Hey <@${client.config.ownerID}>, fix the goddamn code!`);
    console.error(err);
  }
}