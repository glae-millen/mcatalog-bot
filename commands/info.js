//info.js
exports.run = (client, message, args) => {
  if(!args[0]) {
		return message.reply("You entered nothing.");
	}

  var sQuery = args.join(" ").toLowerCase();
  var headers = ["ID", "Release Date", "Brand", "CC Licensable",
                 "Genre", "Subgenre", "Artist(s)", "Title",
                 "Compilation", "Length", "BPM", "Key"]
  const embed = new client.Discord.RichEmbed();
  var x, info, title;
  client.gSheet({key: client.config.sheetKey},
    function(err, spreadsheet) {
      if (err) {
        return console.error(err);
      }
      var sheet = spreadsheet.worksheets[7];
      sheet.cells({worksheet: 8},
        function(err, result) {
          var temp = [];
          if (err) {
            return console.error(err);
          }
          for(x=1;x<=sheet.rowCount;x++) {
            if(result.cells[x][1].value.toLowerCase().includes(sQuery)
              || result.cells[x][8].value.toLowerCase().includes(sQuery)) {
              var output = result.cells[x];
              break;
            }
          }
          if (!output){
            return message.reply("I cannot find a match for that search entry.");
          }
          title = output[8].value;
          for(x=1;x<=12;x++) {
            if (x!=8) {
              if (x==3) {
                switch(output[x].value) {
                  case 'U': temp[x-1] = `**${headers[x-1]}:** Uncaged`; break;
                  case 'I': temp[x-1] = `**${headers[x-1]}:** Instinct`; break;
                  case 'A': temp[x-1] = `**${headers[x-1]}:** Album`; break;
                  case 'M': temp[x-1] = `**${headers[x-1]}:** Mixed`;
                }
              }
              else if (x==4) {
                switch(output[x].value) {
                  case 'Y': temp[x-1] = `**${headers[x-1]}:** Yes`; break;
                  case 'N': temp[x-1] = `**${headers[x-1]}:** No`;
                }
              }
              else {
                temp[x-1] = `**${headers[x-1]}:** ${output[x].value}`;
              }
            }
          }
          temp.splice(7,1);
          info = temp.join("\n");
          embed
            .setColor('DARK_VIVID_PINK')
            .setTitle(`**${title}**`)
            .setDescription(`${info}`)
          message.channel.send(embed).catch(console.error);
      });
    });
}
