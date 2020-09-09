const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require('fs');
const config = require('./config.json');

const appendChunkToFile = (fileName) => {
    const pathToFile = __dirname + `/recordings/${fileName}.pcm`;
    return fs.createWriteStream(pathToFile, { flags: 'a' });
};

client.on('message', msg => {
    if (msg.content.startsWith(config.PREFIX)) {
        const commandBody = msg.content.split(config.PREFIX)[1].split(' ');
        const channelName = commandBody[1];

        if (commandBody[0] === ('enter') && commandBody[1] && commandBody[2]) {
            const voiceChannel = msg.guild.channels.cache.find(channel => channel.name === channelName);

            if (!voiceChannel || voiceChannel.type !== 'voice')
                return msg.reply(`The channel #${channelName} doesn't exist or isn't a voice channel.`);

            console.log(`Sliding into ${voiceChannel.name}...`);
            voiceChannel.join()
                .then(conn => {
                    console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`);
                    const receiver = conn.receiver;
                    conn.on('speaking', (user, speaking) => {
                        if (speaking) {
                            console.log(`${user.username} started speaking`);
                            const audioStream = receiver.createStream(user, { mode: 'pcm' });
                            audioStream.pipe(appendChunkToFile(commandBody[2]));
                            audioStream.on('end', () => { console.log(`${user.username} stopped speaking`); });
                        }
                    });
                })
                .catch(err => { throw err; });
        }
        if (commandBody[0] === ('exit') && commandBody[1]) {
            const voiceChannel = msg.guild.channels.cache.find(channel => channel.name === channelName);
            console.log(`Slipping out of ${voiceChannel.name}...`);
            voiceChannel.leave();
            console.log(`\nSTOPPED RECORDING\n`);
        }
    }
});

client.login(config.BOT_TOKEN);

client.on('ready', () => {
    console.log(`\nONLINE\n`);
});