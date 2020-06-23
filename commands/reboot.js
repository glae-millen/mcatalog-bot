// reboot.js
exports.run = async (client, message, args) =>
{
  // Prevent third-party usage of administrative commands
  if(!(message.author.id == client.config.ownerID || message.author.id == client.config.coID))
    return message.reply(`You don't have the permission to use this command.`);

  // Initialize rebooting sequence
	await message.channel.send("***Restarting...***").catch(console.error);
  console.log("Bot has initiated a reboot. Rebooting...");
  
  // Unload commands
	client.commands.forEach( async cmd =>
  {
		await client.unloadCommand(cmd);
	});
  
  // Reboot the bot
	process.exit(1);
}