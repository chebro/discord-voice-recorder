const fs = require('fs');
const { spawn } = require('child_process');
const { deflateRaw } = require('zlib');

const createNewChunk = (SessionID) => {
    const pathToFile = __dirname + `/../recordings/${SessionID}/${Date.now()}.pcm`;
    return fs.createWriteStream(pathToFile);
};
let voiceSessionMap = [];
let activeGuildRecorders = [];
exports.enter = function(msg, channelName) {
    if (typeof(activeGuildRecorders[msg.member.voice.channel.guild.id]) === "undefined") {
        let voiceChannel;
        if (channelName && channelName.length !== 0) {
            voiceChannel = msg.guild.channels.cache.find(channel => channel.name === channelName);
            if (!voiceChannel || voiceChannel.type !== 'voice')
            return msg.reply(`The channel #${channelName} doesn't exist or isn't a voice channel.`);
        } else {
            voiceChannel = msg.member.voice.channel;
        }
        console.log("enabling lock for guild id", msg.member.voice.channel.guild.id);
        let currentGuildId = msg.member.voice.channel.guild.id;
        activeGuildRecorders[currentGuildId] = true;
        let voiceSid = (Date.now()).toString(36);
        
        fs.mkdirSync(__dirname + `/../recordings/${voiceSid}/`);
        // ChannelName is now an optional argument.
        
        
        console.log(`Sliding into ${voiceChannel.name} ...`);
        msg.channel.send(`[Recorder@${voiceSid}] Starting recording, as requested by ${msg.author.username}. `);
        
        voiceChannel.join()
        .then(conn => {
            let deltaStart = Date.now();
            const dispatcher = conn.play(__dirname + '/../sounds/drop.mp3');
            dispatcher.on('finish', () => { console.log(`Joined ${voiceChannel.name}!\n\nREADY TO RECORD\n`); });
            console.log(voiceChannel);
            voiceSessionMap[voiceChannel.id] = {
                voiceSid: voiceSid,
                activityLog: [],
                guildId: currentGuildId,
                guildName: voiceChannel.guild.name,
                recordInitiator: msg.author.name,
                vcName: voiceChannel.name,
                recordStart: deltaStart
            };
            const receiver = conn.receiver;
            conn.on('speaking', (user, speaking) => {
                if (speaking) {
                    let delta = Date.now() - deltaStart;
                    /*
                        e: EventType
                            "s": Speak start
                            "e": Speak end
                        s: Username
                        d: Delta from 
                    */
                    voiceSessionMap[voiceChannel.id].activityLog.push({
                        e: "s",
                        s: user.username,
                        d: delta
                    })
                    console.log(`${user.username} started speaking`);
                    const audioStream = receiver.createStream(user, { mode: 'pcm' });
                    audioStream.pipe(createNewChunk(voiceSid));
                    audioStream.on('end', () => { 
                        let deltaEnd = Date.now() - deltaStart;
                        console.log(`${user.username} stopped speaking`);
                        voiceSessionMap[voiceChannel.id].activityLog.push({
                            e: "e",
                            s: user.username,
                            d: deltaEnd
                        })
                    });
                }
            });
        })
        .catch(err => {
            console.warn("Failure connecting to guild");
        });
    } else {
        msg.channel.send("An active recording session exists in the current guild.");
    }
    
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
            const resolveSessionId = voiceSessionMap[voiceChannel.id].voiceSid;
            msg.channel.send(`[Recorder@${resolveSessionId}] Stopping recording, as requested by ${msg.author.username}. Please wait as we save metadata.`);
            const dispatcher = conn.play(__dirname + "/../sounds/badumtss.mp3", { volume: 0.45 });
            dispatcher.on("finish", () => {
                let data = JSON.stringify(voiceSessionMap[voiceChannel.id]);
                fs.writeFile(__dirname + `/../recordings/${resolveSessionId}.json`, data, 'utf8', (err) => {
                    
                    if (err) {
                        return console.log(err);
                    }
                    
                    console.log("written stats json", __dirname + `/../recordings/${resolveSessionId}.json`);
                    const nodeArgs = [
                        __dirname + "/../bin/merge.js",
                        resolveSessionId
                    ]
                    const transcoderChild = spawn('node', nodeArgs);
                    transcoderChild.stdout.setEncoding('utf8');
                    transcoderChild.stdout.on('data', function(data) {
                        //Here is where the output goes
                        
                        console.log('transcoder stdout ' + data);
                        
                        data=data.toString();
                    });
                    transcoderChild.on('exit', function (code, signal) {
                        console.log('Transcoder process exited with ' +
                        `code ${code} and signal ${signal}`);
                    });
                }); 
                console.log("Destroying guild lock for", voiceSessionMap[voiceChannel.id].guildId);
                delete activeGuildRecorders[voiceSessionMap[voiceChannel.id].guildId];
                delete voiceSessionMap[voiceChannel.id];
                voiceChannel.leave();
                console.log(`\nSTOPPED RECORDING\n`);
            });
        };
        