exports.format = (client, row) =>
{
  // Initialize Discord embed
  const embed = new client.Discord.MessageEmbed();
  
  // Initialize variables
  var colors = client.colors,
      genre = row.Genre,
      color = 'b9b9b9',
      rawFetch = "",
      temp = [];
  
  
  // Cycle through the colors in colors.json to find a match, bot uses default color if there is no match
  try 
  { 
    color = colors.find(obj => obj.genre == genre).color; 
  }
  catch (err) 
  { 
    console.log(err);
  }
  
  // --DEBUG-- log passed arguments and information
  // console.log(row);
  // console.log(genre, color);
  
  // Initialize embed description build
  var embedDesc;
  
  // Build the embed description
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
  
  // Build the embed
  embed
    .setColor(color)
    .setTitle(`${row.Track}`)
    .setDescription(`by **${row.Artists}**\n${embedDesc}`)  
    .setURL(`https://monstercat.com/release/${row.ID}`)
    
    .addField(`**Genre:**`,            `${row.Genre}`)
    //.addField(`**Artist(s):**`,        `${row.Artists}`)
    
    .addField(`**Catalog:**`,          `${row.ID}`, true)
    .addField(`**Date:**`,             `${row.Date}`, true)
    .addField(`**Compilation:**`,      `${row.Comp}`, true)

    .addField(`**BPM:**`,              `${row.BPM}`, true)
    .addField(`**Key:**`,              `${row.Key}`, true)
    .addField(`**Length:**`,           `${row.Length}`, true)
  
  // Return the formatted embed
  return embed;
}