//index.js, Glitch integratable
const Discord = require("discord.js");
const Enmap = require("enmap");
const fs = require("fs");
const client = new Discord.Client();
const config = require("./config.json");
const gSheet = require('google-spreadsheets');

client.config = config;
client.Discord = Discord;
client.fs = fs;
client.gSheet = gSheet;

const http = require('http');
const express = require('express');
const app = express();

app.get("/", (request, response) =>
{
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});

// Glitch stuff
// app.listen(process.env.PORT);
// setInterval(() =>
// {
//   http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
// }, 280000);
//
// fs.readdir("./events/", (err, files) =>
// {
// 	if (err) return console.error(err);
// 	files.forEach(file =>
//   {
// 		const event = require(`./events/${file}`);
// 		let eventName = file.split(".")[0];
// 		client.on(eventName, event.bind(null, client));
// 	});
// });

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

// Glitch stuff
// client.login(process.env.DISCORD_BOT_TOKEN);
client.login(client.config.token);
