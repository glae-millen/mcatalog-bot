//lookup.js
exports.run = async (client, message, args) =>
{
  // Capture the time at the start of function execution
  var startTime = new Date().getTime();

  // Redefine the 'doc' (sheet) for easier access
  const doc = client.doc;

  // Initialize Discord embed
  var embed;

  // Big try/catch purely to spam ping Hanabi when you're debugging a crashing issue
  try
  {
    // Create a connection between the bot and the Google sheet
    await doc.useServiceAccountAuth(require('../resources/keys/google.json'));
    await doc.loadInfo();

    // Prevent crash from entering empty args
    if(!args[0])
    {
      return message.reply("You entered nothing.");
    }

    // --DEBUG-- Log user input
    console.log("Lookup initiated: ", args);

    // Reinitialize inputs as lowercase
    for (var i = 0; i < args.length; i++)
      args[i] = args[i].toLowerCase();

    // Initialize required variables for sheet lookup
    var rowStr,
        forEmbed,
        rowMatches = 0,
        anyMatch = false,
        matchCounter = [],
        mergedArgs = args.join(" "),
        // headers = ["ID", "Release Date", "Brand", "CC Licensable", "Explicit Content",
        //            "Genre", "Artist(s)", "Title",
        //            "Compilation", "Length", "BPM", "Key"],
        dupes = ["remix", "remake", "vip", "classical", "mix", "ep", "lp"];

    // Automatically find the Catalog sheet. Yay!
    var sheetId = 0;
    doc.sheetsByIndex.forEach(x => {
      if (x.title == "Catalog")
        sheetId = x.sheetId;
    });

    // Get the sheet and an obj array containing its rows
    const sheet = doc.sheetsById[sheetId];
    const rows = await sheet.getRows();

    // Iterate through rows...
    for (var rowNum = 0; rowNum < sheet.rowCount - 1; rowNum++)
    {
      // Create a copy of the current row
      const theRow = rows[rowNum];

      // --DEBUG-- log rows
      // console.log(rows[x]);

      // Reset rowStr and rowMatches
      rowStr = "";
      rowMatches = 0;

      // Initialize rowStr values (takes desired track info from the sheet row)
      rowStr += theRow.ID      + " " +
                theRow.Date    + " " +
                theRow.Artists + " " +
                theRow.Track   + " " +
                theRow.Length  + " ";
      rowStr = rowStr.toLowerCase();
      // Log rowStr (debug)
      // console.log(rowStr);

      // Iterate through user args...
      for (var i = 0; i < args.length; i++)
      {
        // ...and check for matches within rows
        if (rowStr.includes(args[i]))
        {
          // Ignore other renditions of a track when uncalled for
          for (var k = 0; k < dupes.length; k++)
          {
            if (rowStr.includes(dupes[k]) && !mergedArgs.includes(dupes[k])) continue;

            anyMatch = true;
            rowMatches++;
          }
          // --DEBUG-- Log results
          // console.log(`input "${args[i]}" found in row ${x}: ${rowStr}`);
        }
        else continue;
      }

      if (rowMatches != 0)
      {
        matchCounter.push({ row: rowNum, matches: rowMatches });
      }
    }

    console.log(matchCounter);

    // Run if there's a match between args and rowStr
    if (anyMatch)
    {
      var index = 0;

      // Use latest entry
      for (var i = 0; i < matchCounter.length; i++)
      {
        if (matchCounter[i].matches > matchCounter[index].matches)
        {
          index = i;
        }
      }

      // Reassign best match entry
      var theRow = rows[matchCounter[index].row];

      // --DEBUG-- Log best match entry
      // console.log(theRow.Track);

      // Format acquired data
      embed = client.formatter.format(client, theRow);
    }

    // Sad violin music
    else return message.reply("I cannot find a match for that search entry.");
  }
  catch (err)
  {
    // Ping bot owner for error, send error log, and log it
    message.channel.send(`Hey <@${client.config.ownerID}>, fix the goddamn code!`);
    message.channel.send("```" + err + "```");
    console.error(err);
  }

  // Initialize variables for fetching the cover art of the requested track from the Monstercat API
  var releaseID, imageURL;

  // Embed uses default image if fetching fails
  var defaultImage = 'https://i.imgur.com/PoFZk7n.png';

  // Fetch the release ID from the Monstercat API
  await client.fetch(`https://connect.monstercat.com/v2/catalog/release/${theRow.ID}`)
    .then(res => res.json())
    .then(json => releaseID = json.release.id)
    .catch(err => console.error(err));

  // --DEBUG-- log the track's release ID (not to be confused with the catalog ID)
  // console.log(releaseID);

  // Fetch the cover art URL from AWS
  await client.fetch(`https://connect.monstercat.com/v2/release/${releaseID}/cover?image_width=3000`)
    .then(res => imageURL = res.url)
    .catch(err => console.error(err));

  // --DEBUG-- Log the fetched image URL
  // console.log(imageURL);

  // Set the embed thumbnail to the track's cover art, or to the default image if fetching fails
  if (!releaseID)
    embed.setThumbnail(`${defaultImage}`);
  else
    embed.setThumbnail(`${imageURL}`);

  // Capture the time at the end of function execution
  var endTime = new Date().getTime();

  // Calculate and log the total run time of the function
  var funcTime = endTime - startTime;
  console.log(`Retrieved in ${funcTime}ms.`);
  embed.setFooter(`Retrieved in ${funcTime}ms.`, `${client.botAvatar}`);

  // Finally send the message
  message.channel.send(embed).catch(console.error);
}
