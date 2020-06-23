// reload.js
exports.run = (client, message, args) =>
{
  // Prevent third-party usage of administrative commands
  if(!(message.author.id == client.config.ownerID || message.author.id == client.config.coID))
    return message.reply(`You don't have the permission to use this command.`);
  
  // Prevent crash from entering empty args, also you need to enter a command lol
	if(!args[0])
		return message.reply("You reloaded nothing.");
  
  // Initialize args
	const commandName = args[0];
  
  // Return if args does not match a command name
	if(!client.commands.has(commandName))
		return message.reply("That command does not exist.");
  
  // Start reloading sequence
  console.log(`Bot has initiated reloading command "${commandName}". Reloading command...`);
	delete require.cache[require.resolve(`./${commandName}.js`)];
	client.commands.delete(commandName);
	const props = require(`./${commandName}.js`);
	client.commands.set(commandName, props);
	message.channel.send(`***The command ${commandName} has been reloaded.***`);
}