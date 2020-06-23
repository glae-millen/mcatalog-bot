//index.js
// Initialize dependencies
const Discord = require("discord.js");
const client = new Discord.Client();
const Enmap = require("enmap");
const fs = require("fs");
const config = require("./resources/keys/config.json");
const colors = require("./resources/objects/colors.json");
const keyCodes = require("./resources/objects/keyCodes.json");
const { GoogleSpreadsheet } = require('google-spreadsheet');
const fetch = require('node-fetch');
const handler = require("./resources/modules/handler");

// Reinitialize dependencies to let submodules use them
client.config = config;
client.colors = colors;
client.keyCodes = keyCodes;
client.Discord = Discord;
client.fs = fs;
client.gs = GoogleSpreadsheet;
client.fetch = fetch;
client.handler = handler;

// Initialize Google Sheets API
const doc = new client.gs(client.config.sheetKey);
client.doc = doc;

// Initialize events
fs.readdir("./events/", (err, files) =>
{
	if (err) return console.error(err);
	files.forEach(file =>
  {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		client.on(eventName, event.bind(null, client));
	});
});

// Initialize commands
client.commands = new Enmap();

fs.readdir("./commands/", (err, files) =>
{
	if (err) return console.error(err);
	files.forEach(file => {
		if (!file.endsWith(".js"))
			return;
		let props = require(`./commands/${file}`);
		let commandName = file.split(".")[0];
		console.log(`Attempting to load command ${commandName}`);
		client.commands.set(commandName, props);
	});
});

// Finally login
client.login(client.config.token);
