// help.js
exports.run = (client, message, args) =>
{
  // Initialize args and variables
  const hanabi = client.users.cache.get(client.config.ownerID).tag,
        ravalle = client.users.cache.get(client.config.coID).tag,
        embed = new client.Discord.MessageEmbed(),
        prefix = client.config.prefix;
  var mergedArgs = args.join(" ").toLowerCase(),
      color = client.handler.colorize(client);

  try
  {
    // Master embed content
    embed
      .setColor(`${color}`)
      .setTitle(`MCatalog Bot v${client.config.version}`)
      .setThumbnail(`${client.botAvatar}`)
      .setFooter(`Brought to you by ${hanabi} and ${ravalle}.`);

    // Check for cmd help request
    if (mergedArgs == "info")
    {
      embed
        .setTitle(`Command: info`)
        .setFooter(`Badmash: A Discord bot that fetches data from https://rebrand.ly/mcatalog`)
        .addField(`**${prefix}info**: Command information and syntax`, `Basic syntax: \`${prefix}info <search_term>\`\n
                   **To find a remix, VIP, acoustic, etc.** of a song, specify the version in your search, e.g.\n\`${prefix}info slander potions au5 remix\``);
                   //**Please note:** this command is meant for supplying info on a particular track, not searching for a track you may only know little info about.\n
                   //If you are unsure about a track's info, please use \`${prefix}search\`.\nDo \`${prefix}help search\` for more info.`);
    }

    // Default response
    else
    {
      embed
        .setDescription(`Badmash: A Discord bot that fetches data from\nhttps://rebrand.ly/mcatalog\n\n**Prefix: ${prefix}**`)

        .addField(`**Command List**`   , `Below is a list of commands provided by this bot.`)
        .addField(`**${prefix}help**`  , `Displays bot info and lists commands.`)
        .addField(`**${prefix}info**`  , `Shows information on a track.\nSyntax: \`${prefix}info <search_term>\`\nFor more info, do \`${prefix}help info\`.`)
        .addField(`**${prefix}ping**`  , `Tests the bot's response time.`)
        .addField(`**${prefix}uptime**`, `Shows how long the bot has been online.`);
    }

    // Send the embed
  	message.channel.send(embed).catch(console.error);
  }
  catch (err)
  {
    // Ping bot owner for error, send error log, and log it
    client.handler.throw(client, message, err);
  }
}
