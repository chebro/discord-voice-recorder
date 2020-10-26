# Discord Voice Recorder

A tiny [Discord.js](https://discord.js.org/#/) script that can record discord voice calls. Just summon the bot and to the voice channel and record a multi-user call! Jump to [Installation & Usage](https://github.com/sravanth-chebrolu/discord-voice-recorder#installation-and-usage) to learn how to run the script and save the audio to your local device.

<img src="https://i.imgur.com/y6JCNNA.png" width="400" align="center">

### Content

-    [Installation and Usage](#installation-and-usage)
     -    [Download the Source and Install FFmpeg](#download-the-source-and-install-ffmpeg)
     -    [Setting Up the Local Environment](#setting-up-the-local-environment)
     -    [Running the Script](#running-the-script)
          -    [Start Recording](#start-recording)
          -    [Stop Recording](#stop-recording)
     -    [Managing the Output](#managing-the-output)
          -    [Merge Recording](#merge-recording)
          -    [Convert the Merged File to MP3](#convert-the-merged-file-to-mp3)
-    [Thanks](#thanks)

## Installation and Usage

### Download the Source and Install FFmpeg

Clone the repository : 
```
git clone https://github.com/sravanth-chebrolu/discord-voice-recorder/
```

Run `npm i` to install the dependent `node_modules`.

Next head over to the [FFmpeg.org](https://ffmpeg.org/download.html), and download the executables for your OS; If you're on Windows, double check if ffmpeg bin is on your path.

### Setting Up the Local Environment

To run this script locally you will need to [create a discord bot](https://discordpy.readthedocs.io/en/latest/discord.html) first. Invite your bot to your server(to avoid potential problems, it is recommended that the bot be given adminstrator privileges when creating the initve link). Follow the next steps to finish the setup:

1. Create a `config.json` file and a `recordings` folder at the root directory.
2. Copy the the bot token from the [developer window](https://discord.com/developers/applications).
3. Choose a prefix you want the bot to answer to.

Paste the bot token and the prefix value to your config.json, like this:

```
{
    "BOT_TOKEN": "<your-bot-token>",
    "PREFIX": "<your-prefix>"
}
```

And you're all set. Note that all your recordings will be saved to the `recordings` directory.

### Running the Script

To run the script just run:

```
npm start
```

The bot should be online and you can run the bot commands in your discord server. There are only two commands currently,

#### Start Recording

```
<PREFIX>enter <VOICE_CHANNEL_NAME>
```

This will summon the bot into the voice channel mentioned in the arguments and start recording the audio. You should hear a 'drop' sound when you run the command indicating that the connection has been established. If you don't hear the sound, there's a problem with the ffmpeg installation. 

#### Stop Recording

```
<PREFIX>exit <VOICE_CHANNEL_NAME>
```

This will remove the bot from the mentioned voice channel and the recording will stop. 

### Managing the Output

Keep in mind that the audio will be recorded in the [PCM format](https://en.wikipedia.org/wiki/Pulse-code_modulation).

> To work with PCM audio, you could use software such as [Audacity](https://www.audacityteam.org/). To import the audio into Audacity, open File > Import > Raw Data... and then select your audio file. You should select Signed 16-bit PCM as the encoding, a Little-endian byte order, 2 Channels (Stereo) and a sample rate of 48000Hz. 

#### Merge Recording

```
node ./bin/merge.js
``` 

This will generate a merged output of all the individual PCM output files to a `merge.pcm` file in the `recordings` directory.

#### Convert the Merged File to MP3

Since FFmpeg is a dependency, we can use it to convert the raw `.pcm` file to a more user friendly `.mp3` format, mentioned in #3 this can be done using:

```
ffmpeg -f s16le -ar 44.1k -ac 2 -i merge.pcm output.mp3
```


# Thanks

Also, thanks @eslachance for the gist, which is what this code is based on. https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba.
