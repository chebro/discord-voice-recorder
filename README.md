# Discord Voice Recorder

A [Discord.js](https://discord.js.org/#/) script which can record voice calls. Summon the bot to a voice channel, and voilà! the audio is piped right into your local machine.

Jump to [Installation & Usage](https://github.com/sravanth-chebrolu/discord-voice-recorder#installation-and-usage) to get started.

_Recording voice calls without prior consent violates privacy. Do not use this bot without approval. I'm not responsible for your insanity._

<img src="https://i.imgur.com/y6JCNNA.png" width="400" align="center">

-    [Installation and Usage](#installation-and-usage)
     -    [Setting Up the Local Environment](#setting-up-the-local-environment)
     -    [Running the Script](#running-the-script)
          -    [Start Recording](#start-recording)
          -    [Stop Recording](#stop-recording)
-    [Managing the Output](#managing-the-output)
     -    [Merge Recording](#merge-recording)
     -    [Convert the Merged File to MP3](#convert-the-merged-file-to-mp3)
-    [Thanks](#thanks)

## Installation and Usage

Clone the repository : 
```
git clone https://github.com/sravanth-chebrolu/discord-voice-recorder/
```

Run `npm i` to download necessary `node_modules`. Then, head over to the [FFmpeg.org](https://ffmpeg.org/download.html), and download executables for your OS; If you're on Windows, double-check if the FFmpeg bin is on your path.

### Setting Up the Local Environment

To run this script locally, [create a discord bot](https://discordpy.readthedocs.io/en/latest/discord.html) first. Invite the bot to your server, then:

1. Create a `config.json` file and a `recordings` folder at the root folder.
2. Paste the bot token (from [developer window](https://discord.com/developers/applications)) and any bot prefix into `config.json`, like so:

```yaml
{
    "BOT_TOKEN": "<YOUR_BOT_TOKEN>",
    "PREFIX": "<BOT_PREFIX>"
}
```

### Running the Script

Run `npm start`, the bot should be online.

#### Start Recording

```
<PREFIX>enter <VOICE_CHANNEL_NAME>
```

**Note:** You should hear a 'drop' sound after running this. If you don't, there's a problem with your FFmpeg installation.

#### Stop Recording

```
<PREFIX>exit
```

## Managing the Output

The audio will be recorded in [PCM format](https://en.wikipedia.org/wiki/Pulse-code_modulation) and saved to the `/recordings` directory.

_To work with PCM audio, you could use software such as [Audacity](https://www.audacityteam.org/). To import the audio into Audacity, open File > Import Raw Data... and then select your audio file. You should select Signed 16-bit PCM as the encoding, a Little-endian byte order, 2 Channels (Stereo) and a sample rate of 48000Hz._

### Merge Recording

The output for each piece of audio stream is written to a unique file. To merge all output files, run:

```
node ./bin/merge.js
``` 

This creates a `merge.pcm` in the `/recordings` directory.

**Note:** Do not forget to empty your `recordings` folder after each session. Running `./bin/merge.js` otherwise, will dump large merge files.

### Convert the Merged File to MP3

As mentioned in issue [#3](https://github.com/sravanth-chebrolu/discord-voice-recorder/issues/3), to convert pcm to mp3, run:

```
ffmpeg -f s16le -ar 44.1k -ac 2 -i merge.pcm output.mp3
```

## Thanks

Special thanks to [@eslachance](https://github.com/eslachance) for the [gist](https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba). It is what inspired me to make this repo.
