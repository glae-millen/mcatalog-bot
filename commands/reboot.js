//reboot.js
exports.run = async (client, message, args) =>
{
  if(!(message.author.id == client.config.ownerID || message.author.id == client.config.testerIDs))
    return message.reply(`You don't have the permission to use this command.`);

	await message.channel.send("***Restarting...***").catch(console.error);
  console.log("Bot has initiated a reboot. Rebooting...");
	client.commands.forEach( async cmd =>
  {
		await client.unloadCommand(cmd);
	});

	process.exit(1);
};
