//reboot.js
exports.run = async (client, message, args) => {
  if(message.author.id != client.config.ownerID){
    return message.reply(`You don't have the permission to use this command.`);
  }

	await message.channel.send("***Restarting...***").catch(console.error);
	client.commands.forEach( async cmd => {
		await client.unloadCommand(cmd);
	});
	process.exit(1);
};
