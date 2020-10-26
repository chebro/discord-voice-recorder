const fs = require('fs');

const createNewChunk = () => {
    const pathToFile = __dirname + `/../recordings/${Date.now()}.pcm`;
    return fs.createWriteStream(pathToFile);
};

exports.enter = function(msg, channelName) {
    const voiceChannel = msg.guild.channels.cache.find(channel => channel.name === channelName);

    if (!voiceChannel || voiceChannel.type !== 'voice')
        return msg.reply(`The channel #${channelName} doesn't exist or isn't a voice channel.`);

    console.log(`Sliding into ${voiceChannel.name} ...`);
    voiceChannel.join()
        .then(conn => {

            const dispatcher = conn.play(__dirname + '/../sounds/drop.mp3');
            dispatcher.on('finish', () => { console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`); });

            const receiver = conn.receiver;
            conn.on('speaking', (user, speaking) => {
                if (speaking) {
                    console.log(`${user.username} started speaking`);
                    const audioStream = receiver.createStream(user, { mode: 'pcm' });
                    audioStream.pipe(createNewChunk());
                    audioStream.on('end', () => { console.log(`${user.username} stopped speaking`); });
                }
            });
        })
        .catch(err => { throw err; });
}

exports.exit = function (msg) {
    // Use optional chaining when we upgrade to Node 14.
    if (
        !(
            msg &&
            msg.guild &&
            msg.guild.voice &&
            msg.guild.voice.channel &&
            msg.guild.voice.connection
        )
    )
        return;

    const { channel: voiceChannel, connection: conn } = msg.guild.voice;
    const dispatcher = conn.play(__dirname + "/../sounds/badumtss.mp3", { volume: 0.45 });
    dispatcher.on("finish", () => {
        voiceChannel.leave();
        console.log(`\nSTOPPED RECORDING\n`);
    });
};