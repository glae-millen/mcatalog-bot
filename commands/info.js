//info.js
exports.run = (client, message, args) =>
{
  try
  {
    //prevent crash from entering empty args
    if(!args[0])
    {
      return message.reply("You entered nothing.");
    }
    //reinitialize inputs as lowercase
    for (var i = 0; i < args.length; i++)
    {
      //console.log(args[i]);
      args[i] = args[i].toLowerCase();
    }

    const embed = new client.Discord.RichEmbed();
    var info, title, forEmbed,
        mergedArgs = args.join(" "),
        headers = ["ID", "Release Date", "Brand", "CC Licensable", "Explicit Content",
                   "Genre", "Subgenre", "Artist(s)", "Title",
                   "Compilation", "Length", "BPM", "Key", "Fan Rating"],
        dupes = ["remix", "remake", "vip", "classical", "mix"];

    client.gSheet({key: client.config.sheetKey},
      function(err, spreadsheet)
      {
        if (err)
          return console.error(err);

        var sheet = spreadsheet.worksheets[5];
        // Debug code to find the current sheet number for the catalog
        // return console.log(spreadsheet.worksheets);
        sheet.cells({worksheet: 6},
          function(err, theSheet)
          {
            var temp = [];
            if (err)
            {
              return console.error(err);
            }

            var matchCounter = [];
            var anyMatch = false;

            // iterate through rows
            for (var x = 1; x <= sheet.rowCount; x++)
            {
              // create space in matchCounter
              matchCounter.push(0);
              matchCounter[x] = 0;

              // create rowStr
              var rowStr = "";

              // init rowStr values
              for (var j = 1; j <= sheet.colCount; j++)
              {
                if (theSheet.cells[x][j] === undefined) continue;
                rowStr += theSheet.cells[x][j].value.toLowerCase() + " ";
              }

              // iterate through inputted words (space sep) and check for matches within row
              for (var i = 0; i < args.length; i++)
              {
                if (rowStr.includes(args[i]))
                {
                  //ignore other renditions of a track when uncalled for
                  for (var k = 0; k < dupes.length; k++)
                  {
                    if (rowStr.includes(dupes[k]) && !mergedArgs.includes(dupes[k])) continue;
                    anyMatch = true;
                    matchCounter[x]++;
                  }
                  //console.log(`input "${args[i]}" found in row ${x}: ${rowStr}`);
                }
                else continue;
              }
            }

            if (!anyMatch)
            {
              return message.reply("I cannot find a match for that search entry.");
            }

            var indexOfMax = 0;
            for (var i = 0; i < matchCounter.length; i++)
            {
              if (matchCounter[i] > matchCounter[indexOfMax])
              {
                //console.log(theSheet.cells[i]);
                indexOfMax = i;
              }
            }

            var output = "";
            for (var j = 1; j <= sheet.colCount; j++)
            {
              if (theSheet.cells[indexOfMax][j] === undefined) continue;
              output += theSheet.cells[indexOfMax][j].value+ " | ";
            }
            forEmbed = theSheet.cells[indexOfMax];
            //console.log(output);

            title = forEmbed[9].value;

            //formatting
            for(x=1;x<=14;x++)
            {
              if (x!=9)
              {
                if (x==3)
                {
                  switch(forEmbed[x].value)
                  {
                    case 'U': temp[x-1] = `**${headers[x-1]}:** Uncaged`; break;
                    case 'I': temp[x-1] = `**${headers[x-1]}:** Instinct`; break;
                    case 'A': temp[x-1] = `**${headers[x-1]}:** Album`; break;
                    case 'M': temp[x-1] = `**${headers[x-1]}:** Mixed`;
                  }
                }
                else if (x==4)
                {
                  switch(forEmbed[x].value)
                  {
                    case 'Y': temp[x-1] = `**${headers[x-1]}:** Yes`; break;
                    case 'N': temp[x-1] = `**${headers[x-1]}:** No`;
                  }
                }
                else if (x==5)
                {
                  switch(forEmbed[x].value)
                  {
                    case 'C': temp[x-1] = `**${headers[x-1]}:** Clean`; break;
                    case 'E': temp[x-1] = `**${headers[x-1]}:** Explicit`; break;
                    case '-': temp[x-1] = `**${headers[x-1]}:** -`;
                  }
                }
                else if (x==14)
                {
                  if (forEmbed[x] === undefined)
                  {
                    temp[x-1] = `**${headers[x-1]}:** N/A`;
                  }
                  else
                  {
                    temp[x-1] = `**${headers[x-1]}:** ${forEmbed[x].value}`;
                  }
                }
                else
                {
                  temp[x-1] = `**${headers[x-1]}:** ${forEmbed[x].value}`;
                }
              }
            }

            temp.splice(8,1);
            info = temp.join("\n");

            embed
              .setColor('888888')
              .setTitle(`**${title}**`)
              .setDescription(`${info}`)

            message.channel.send(embed).catch(console.error);
          });
      });
  }
  catch (err)
  {
    message.channel.send(`Hey <@${client.config.ownerID}>, fix the goddamn code!`);
    console.error(err);
  }
}
