//reload.js
exports.run = (client, message, args) =>
{
  if(!(message.author.id == client.config.ownerID || message.author.id == client.config.testerIDs))
    return message.reply(`You don't have the permission to use this command.`);

	if(!args[0])
		return message.reply("You reloaded nothing.");

	const commandName = args[0];
	if(!client.commands.has(commandName))
		return message.reply("That command does not exist.");

  console.log(`Bot has initiated reloading command "${commandName}". Reloading command...`);
	delete require.cache[require.resolve(`./${commandName}.js`)];
	client.commands.delete(commandName);
	const props = require(`./${commandName}.js`);
	client.commands.set(commandName, props);
	message.channel.send(`***The command ${commandName} has been reloaded.***`);
};
