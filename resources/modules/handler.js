// Formatting handler for lookup embed
exports.format = async (client, row) =>
{
  // Initialize Discord embed
  const embed = new client.Discord.MessageEmbed();
  
  // Initialize variables
  var colors = client.colors,
      genre = row.Genre,
      color = 'b9b9b9';

  // Cycle through the colors in colors.json to find a match, bot uses default color if there is no match
  try 
  { 
    color = colors.find(obj => obj.genre == genre).color;
  }
  catch (err) 
  { 
    // console.log(err);
  }
  
  // --DEBUG-- log passed arguments and information
  // console.log(row);
  // console.log(genre, color);
  
  // Initialize and build the embed description
  var embedDesc;
  
  switch (row.CC)
  {
    case 'Y': embedDesc = `✅ Safe for content creators`; break;
    default:  embedDesc = `⚠️ Not safe for content creators`;
  }
  
  switch (row.E)
  {
    case 'E': embedDesc += `\n⚠️ Explicit content`; break;
    case 'C': break;
    case 'I': break;
    default: embedDesc += `\n⚠️ Possible explicit content`; break;
  }

  // Initialize variables for fetching the cover art of the requested track from the Monstercat API
  var releaseID, imageURL;

  // Embed uses default image if fetching fails
  var defaultImage = "https://i.imgur.com/PoFZk7n.png";

  // Fetch the release ID from the Monstercat API
  await client.fetch(`https://connect.monstercat.com/v2/catalog/release/${row.ID}`)
    .then(res => res.json())
    .then(json => (releaseID = json.release.id))
    .catch(err => console.error(err));

  // --DEBUG-- log the track's release ID (not to be confused with the catalog ID)
  // console.log(releaseID);

  // Fetch the cover art URL from AWS
  await client.fetch(`https://connect.monstercat.com/v2/release/${releaseID}/cover?image_width=3000`)
    .then(res => (imageURL = res.url))
    .catch(err => console.error(err));

  // --DEBUG-- Log the fetched image URL
  // console.log(imageURL);

  // Set the embed thumbnail to the track's cover art, or to the default image if fetching fails
  if (!releaseID) embed.setThumbnail(`${defaultImage}`);
  else embed.setThumbnail(`${imageURL}`);
  
  // Build the embed
  embed
    .setColor(color)
    .setTitle(`${row.Track}`)
    .setDescription(`by **${row.Artists}**\n${embedDesc}`)  
    .setURL(`https://monstercat.com/release/${row.ID}`)
    
    .addField(`**Genre:**`,            `${row.Genre}`)
    
    .addField(`**Catalog:**`,          `${row.ID}`, true)
    .addField(`**Date:**`,             `${row.Date}`, true)
    .addField(`**Compilation:**`,      `${row.Comp}`, true)

    .addField(`**BPM:**`,              `${row.BPM}`, true)
    .addField(`**Key:**`,              `${row.Key}`, true)
    .addField(`**Length:**`,           `${row.Length}`, true)
  
  // Return the formatted embed
  return embed;
}

// Custom error handling management
exports.throw = (client, message, err) =>
{
  message.channel.send(`Hey <@${client.config.ownerID}>, fix the goddamn code!`);
  message.channel.send("```" + err + "```");
  console.error(err);
}

// Picks a random color from colors.json
exports.colorize = (client) =>
{
  return client.colors[Math.floor(Math.random() * client.colors.length)].color
}