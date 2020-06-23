//info.js, deprecated
exports.run = (client, message, args) =>
{
  // Capture the time at the start of function execution
  var startTime = new Date().getTime();
  
  const embed = new client.Discord.MessageEmbed();
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

    var info, title, forEmbed,
        mergedArgs = args.join(" "),
        headers = ["ID", "Release Date", "Brand", "CC Licensable", "Explicit Content",
                   "Genre", "Artist(s)", "Title",
                   "Compilation", "Length", "BPM", "Key"],
        dupes = ["remix", "remake", "vip", "classical", "mix"];

    client.gSheet({key: client.config.sheetKey},
      function(err, spreadsheet)
      {
        if (err)
          return console.error(err);

        var sheet = spreadsheet.worksheets[2];
        // Debug code to find the current sheet number for the catalog
        // return console.log(spreadsheet.worksheets);
        sheet.cells({worksheet: 3},
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
                  console.log(`input "${args[i]}" found in row ${x}: ${rowStr}`);
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
            /*console.log(forEmbed);
              for (var i = 0; i < 12; i++)
              {
                try{
                  forEmbed[i].value;
                }
                catch(err){
                  forEmbed[i].value = '?';
                }
              }
            return console.log(forEmbed);*/
            //console.log(output);

            try 
            {
              title = forEmbed[8].value;
            }
            catch(err) 
            {
              title = '?';
            }

            //formatting
            for(x = 1; x <= 12; x++)
            {
              try
              {
                if (x!=8)
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
                      case 'I': temp[x-1] = `**${headers[x-1]}:** Instrumental`; break;
                      case '-': temp[x-1] = `**${headers[x-1]}:** -`;
                    }
                  }
                  else
                  {
                    temp[x-1] = `**${headers[x-1]}:** ${forEmbed[x].value}`;
                  }
                }
              }
              catch(err)
              {
                temp[x-1] = `**${headers[x-1]}:** ?`;
              }
            }

            temp.splice(7,1);
            info = temp.join("\n");
          
            var genre;
            try { genre = forEmbed[6].value; }
            catch(err) { genre = '?'; }
          
            var color = 'b9b9b9';

            var genres =
                ['Hip Hop', 'Traditional', 'Future Bass', 'UK Garage', 'Instinct', 'Downtempo / Ambient', 'Drum & Bass', 'Experimental',
                 'House', 'Electro House', 'Hardcore', 'Midtempo', 'Pop', 'Trance', 'Dubstep', 'Drumstep', 'Trap', 'Metal', 'Punk', 'Breaks',
                 'Rock', 'R&B', 'Industrial', 'Uncaged', 'Synthwave', 'Moombah', 'Glitch Hop'];
            var colors = 
                ['d77f7d', 'd0ad60', '9090ff', 'bf7fff', 'faeccf', 'f0b4b5', 'f61a03', '757c65', 'eb8200', 'e1c500', '009600', '0a9655', '16acb0',
                 '0080e6', '941de8', 'd5007f', '810029', '003a12', '3a003a', '0a1857', '87c095', '6988a2', '282828', '1c1c1c', '674ea7', '0a9655', '0a9655'];

            for (var i = 0; i < genres.length; i++)
            {
              if (genres[i] == genre)
              {
                color = colors[i];
              }
            }

            embed
              .setColor(color)
              .setTitle(`**${title}**`)
              .setDescription(`${info}`);
          // Capture the time at the end of function execution
          var endTime = new Date().getTime();

          // Calculate and log the total run time of the function
          var funcTime = endTime - startTime;
          console.log(`Retrieved in ${funcTime}ms.`);
          embed.setFooter(`Retrieved in ${funcTime}ms.`);

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