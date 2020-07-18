// reboot.js
const { Command } = require('discord.js-commando');

module.exports = class extends Command
{
  constructor(client)
  {
    super(client,
    {
      name: 'reboot',
      group: 'admin',
      memberName: 'reboot',
      description: 'Reboots the bot',
      examples: [`${client.commandPrefix}reboot`]
    });
  }

  async run(message)
  {
    // Prevent third-party usage of administrative commands
    if (!(message.author.id == this.client.config.ownerID || message.author.id == this.client.config.coID))
      return message.reply(`You don't have the permission to use this command.`);

    // Initialize rebooting sequence
    await message.channel.send("***Restarting...***").catch(console.error);
    await console.log("Bot has initiated a reboot. Rebooting...");

    // Reboot the bot
    process.exit(1);
  }
}