//uptime.js
exports.run = (client, message, args) => {
  const embed = new client.Discord.RichEmbed();
  var x, send = [];

	let totalSeconds = (client.uptime / 1000);
  let days = Math.floor(totalSeconds / 86400);
  totalSeconds %= 86400;
  let hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = Math.floor(totalSeconds % 60);
  let uptime = `The bot has been up for `;
  let dsend = `${days} day`;
  let hrsend = `${hours} hour`;
  let minsend = `${minutes} minute`;
  let ssend = `${seconds} second`;

  if (days > 1) dsend += `s`;
  if (hours > 1) hrsend += `s`;
  if (minutes > 1) minsend += `s`;
  if (seconds > 1) ssend += `s`;

  if (days > 0) send.push(dsend);
  if (hours > 0) send.push(hrsend);
  if (minutes > 0) send.push(minsend);
  if (seconds > 0) send.push(ssend);

  if (send.length == 1) uptime += send + `.`;
  else
  {
    for (x = 0; x < send.length; x++)
    {
      if (x == send.length - 2)
      {
        if (send.length == 2) uptime += send[x] + ` and `;
        else uptime += send[x] + `, and `;
      }
      else if (x == send.length - 1) uptime += send[x] + `.`;
      else uptime += send[x] + `, `;
    }
  }

	embed
		.setColor('DARK_VIVID_PINK')
		.setTitle(`:timer: ${uptime}`)
	message.channel.send(embed).catch(console.error);
}
