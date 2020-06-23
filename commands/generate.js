// generate.js
exports.run = async (client, message, args) =>
{
  // Capture the time at the start of function execution
  var startTime = new Date().getTime();

  // Redefine the 'doc' (sheet) for easier access and initialize Discord embed
  const doc = client.doc;
  const embed = new client.Discord.MessageEmbed();
  
  const keyCodes = client.keyCodes;
  var msg = "";

  // Big try/catch purely to spam ping Hanabi when you're debugging a crashing issue
  try
  {
    // Create a connection between the bot and the Google sheet
    await doc.useServiceAccountAuth(require("../resources/keys/google.json"));
    await doc.loadInfo();

    // Automatically find the Catalog sheet. Yay!
    var sheetId = 0;
    doc.sheetsByIndex.forEach(x => {
      if (x.title == "Catalog") sheetId = x.sheetId;
    });

    // Get the sheet and an obj array containing its rows
    const sheet = doc.sheetsById[sheetId];
    const rows = await sheet.getRows();

    // Pick two random releases
    var numTracks = args, tracks = [];
    for (var i = 0; i < numTracks; i++)
    {
      tracks.push(pickTrack(rows, "Dubstep"))
    }

    var totBPM = 0, totKey = 0, avgBPM, avgKey;
    tracks.forEach(track =>
    {
      msg += (`${track.Artists} - ${track.Track}\n`);
      totBPM += parseInt(track.BPM);
      totKey += getKeyID(track.Key, keyCodes);
    });

    console.log(totBPM, totKey);
    avgBPM = totBPM / tracks.length;
    avgKey = getKeyFromID(Math.floor(totKey / tracks.length), keyCodes);
    msg += `Suggested bpm: ${avgBPM}\nSuggested key: ${avgKey}`;
    message.channel.send(msg);
  }
  catch (err)
  {
    // Ping bot owner for error, send error log, and log it
    client.handler.throw(client, message, err);
  }

  // Calculate and log the total run time of the function
  var funcTime = Date.now() - startTime;
  //console.log(`Retrieved in ${funcTime}ms.`);
  embed.setFooter(`Retrieved in ${funcTime}ms.`, `${client.botAvatar}`);

  // Finally send the message
  //message.channel.send(embed).catch(console.error);

  function pickTrack(rows, desiredGenre = "*")
  {
    var genre, track;
    for (var i = 0; i < 20; i++) 
    {
      track = rows[Math.floor(Math.random() * rows.length)];
      genre = track.Genre;
      //console.log(`Randomised track with genre: ${genre} and key ${track.Key}`);
      
      if (validGenre(genre) && validKey(track.Key)) {
        if (desiredGenre == "*" || genre == desiredGenre) {
          console.log(`Settled on track: ${track.Track}. Genre: ${genre}`);
          break;
        }
      }
    }
    console.log(`Defaulted to track: ${track.Track}. Genre: ${genre}`);
    return track;
  }

  function validGenre(genre)
  {
    genre = genre.toLowerCase();
    if (genre != "album" &&
        genre != "ep" &&
        genre != "compilation" &&
        genre != "intro" &&
        genre != "miscellaneous" &&
        genre != "orchestral" &&
        genre != "traditional")
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  function getKeyID(key, keyCodes)
  {
    key = key.toLowerCase();

    var keyID = parseInt(keyCodes.find(obj =>
      obj.major.toLowerCase() == key || obj.minor.toLowerCase() == key
    ).keyID);

    console.log(key, keyID);
    return keyID;
  }

  function getKeyFromID(keyID, keyCodes)
  {
    var key = keyCodes.find(obj => obj.keyID == keyID).minor;
    console.log(keyID, key);
    return key;
  }

  function validKey(key)
  {
    try
    {
      var keyID = getKeyID(key, client.keyCodes);
      return true;
    }
    catch(err)
    {
      console.error(err);
      return false;
    }
  }
}