// info.js (lookup.js in alpha branch)
exports.run = async (client, message, args) => {
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
    await doc.useServiceAccountAuth(require("../resources/keys/google.json"));
    await doc.loadInfo();

    // Prevent crash from entering empty args
    if (!args[0])
      return message.reply("You entered nothing.");

    // --DEBUG-- Log user input
    // console.log("Lookup initiated: ", args);

    // Reinitialize inputs as lowercase
    for (var i = 0; i < args.length; i++) args[i] = args[i].toLowerCase();

    // Initialize required variables for sheet lookup
    var rowStr, theRow, debug,
        rowMatches = 0,
        anyMatch = false,
        matchCounter = [],
        mergedArgs = args.join(" "),
        dupes = [ "remix", "remake", "vip", "classical", "mix" ];

    // Automatically find the Catalog sheet. Yay!
    var sheetId = 0;
    doc.sheetsByIndex.forEach(x => {
      if (x.title == "Catalog") sheetId = x.sheetId;
    });

    // Get the sheet and an obj array containing its rows
    const sheet = doc.sheetsById[sheetId];
    const rows = await sheet.getRows();

    // Iterate through rows...
    for (var rowNum = 0; rowNum < sheet.rowCount - 1; rowNum++)
    {
      // Create a copy of the current row
      theRow = rows[rowNum];
      var weight = 1;
      rowMatches = 0;

      // Initialize rowStr values (takes desired track info from the sheet row)
      rowStr = (
        theRow.ID      + " " +
        theRow.Artists + " " +
        theRow.Track   + " "
        ).toLowerCase();

      // EPs, albums, and compilations have a lower weight in terms of search accessibility
      if (theRow.Genre.toLowerCase() == "ep" ||
          theRow.Genre.toLowerCase() == "album" ||
          theRow.Genre.toLowerCase() == "compilation")
        weight = 0.5;

      // Log rowStr (debug)
        //console.log(rowStr);

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
              rowMatches += weight;
            }
            // --DEBUG-- Log results
            //console.log(`input "${args[i]}" found in row ${x}: ${rowStr}`);
          }
          else continue;
        }

        if (rowMatches != 0)
          matchCounter.push({ row: rowNum, matches: rowMatches });
      }

      // Run if there's a match between args and rowStr
      if (anyMatch)
      {
        var index = 0;

        // --DEBUG-- Weight checking p.1
        // debug = `Initial selection: ${rows[index].Track}`;

        // Use latest entry
        for (var i = 0; i < matchCounter.length; i++)
        {
          if (matchCounter[i].matches > matchCounter[index].matches)
          {
            // --DEBUG-- Weight checking p.2
            // debug += `\nRelease ${rows[i].Artists} - ${rows[i].Track} has a greater weight than ${rows[i].Artists} - ${rows[index].Track}, switching selection`;
            index = i;
          }
        }
        // --DEBUG-- Log weight check
        // console.log(debug);

        // Reassign best match entry
        theRow = rows[matchCounter[index].row];

        // --DEBUG-- Log best match entry
        //console.log(theRow.Track);

        // Format acquired data
        embed = await client.handler.format(client, theRow);
      }

      // Sad violin music
      else return message.reply("I cannot find a match for that search entry.");
  }
  catch (err)
  {
    // Ping bot owner for error, send error log, and log it
    client.handler.throw(client, message, err);
  }

  // Calculate and log the total run time of the function
  var funcTime = Date.now() - startTime;
  embed.setFooter(`Retrieved in ${funcTime}ms.`, `${client.botAvatar}`);

  // Finally send the message
  message.channel.send(embed).catch(console.error);
};
