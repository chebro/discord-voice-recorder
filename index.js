const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const commands = require(`./bin/commands`);

client.on('message', msg => {
    if (msg.content.startsWith(config.PREFIX)) {
        const commandBody = msg.content.substring(config.PREFIX.length).split(' ');
        const channelName = commandBody.slice(1).join(" ");

        if (commandBody[0].startsWith('enter')) commands.enter(msg, channelName);
        if (commandBody[0] === ('exit')) commands.exit(msg);
    }
});

client.login(config.BOT_TOKEN);

client.on('ready', () => {
    console.log(`\nONLINE\n`);
});