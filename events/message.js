//message.js
module.exports = (client, message) =>
{
	if (message.content.indexOf(client.config.prefix) !== 0 || message.author.bot) return;
	const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const cmd = client.commands.get(command);
	if (!cmd) return;
	cmd.run(client, message, args)
}
