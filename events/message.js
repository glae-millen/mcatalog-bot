//message.js
module.exports = (client, message) =>
{
  // Easy access for the bot avatar
  const botAvatar = client.users.cache.get(client.config.botID).avatarURL();
  client.botAvatar = botAvatar;
  
  // Read commands from user input
	if (message.content.indexOf(client.config.prefix) !== 0 || message.author.bot) return;
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command);
	if (!cmd) return;
  
  // Run the command
	cmd.run(client, message, args);
}
