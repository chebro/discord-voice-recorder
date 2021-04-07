# Discord Voice Recorder

A [Discord.js](https://discord.js.org/#/) script which can record voice calls. Summon the bot to a voice channel, and voilà! the audio is piped right into your local machine. Jump to [Installation & Usage](https://github.com/chebro/discord-voice-recorder#installation-and-usage) to get started.

<img src="https://i.imgur.com/faOjepH.png" width="500" align="right">

### Index
-    [Installation and Usage](#installation-and-usage)
     -    [Run Locally](#run-locally)     
	 -	  [Run in Container](#run-in-container)
	 -	  [Bot Commands](#bot-commands)
-    [Managing the Output](#managing-the-output)
     -    [Merge Recording](#merge-recording)
     -    [Convert the Merged File to MP3](#convert-the-merged-file-to-mp3)

_**Note:** Recording voice calls without prior consent violates privacy. Do not use this bot without approval. I'm not responsible for your insanity._

_Also, multi user recording is currently out of discord.js's scope, currently a unique stream is created for every user, but the end result is a very bad audio output, [more info](https://discordjs.guide/voice/receiving-audio.html#what-if-i-want-to-listen-to-multiple-users)._

## Installation and Usage

Clone the repository : 
```
git clone https://github.com/chebro/discord-voice-recorder/
```

[Create a discord bot](https://discordpy.readthedocs.io/en/latest/discord.html) if you don't have one already and invite the bot to your server, then:

1. Create `config.json` file and a `/recordings` directory at the root folder.
2. Paste the bot token (from [developer window](https://discord.com/developers/applications)) and any bot prefix into `config.json`, like so:

```yaml
{
    "BOT_TOKEN": "<YOUR_BOT_TOKEN>",
    "PREFIX": "<BOT_PREFIX>"
}
```

You can run the script in any of the following two ways:

### Run Locally

1. Run `npm i` to download necessary `node_modules`.

2. Run `npm start`.

The bot should be online.

### Run in Container

1. Build the docker image: 

```
docker build -t dvr .
```

2. Bind `/recordings` directory on host to container and start the container with a custom name:

```
docker run \          
  --name <CONTAINER_NAME> \     
  --mount type=bind,source="$(pwd)"/recordings,target=/usr/src/bot/recordings \
  dvr
```

The bot should be online.

### Bot Commands

+ Start Recording : `<PREFIX>enter <VOICE_CHANNEL_NAME>`

+ Stop Recording  : `<PREFIX>exit`

## Managing the Output

The output for each piece of audio stream is written to a unique file in [PCM format](https://en.wikipedia.org/wiki/Pulse-code_modulation) (48000 Hz, signed 16-bit little-endian, 2 channel (stereo)) and saved to the `/recordings` directory.

### Merge Recording

To merge all output files to `/recordings/merge.pcm`, run:

```
node /bin/merge.js
``` 

**Note:** Empty your `recordings` folder (and remove `merge.pcm`) after each session. Running `./bin/merge.js` otherwise will dump large merge files.

### Convert the Merged File to MP3

Head over to [FFmpeg.org](https://ffmpeg.org/download.html), and download executables for your OS; If you're on Windows, double-check if the FFmpeg bin is on your path. As discussed in issue [#3](https://github.com/chebro/discord-voice-recorder/issues/3), to convert pcm to mp3, run:

```
ffmpeg -f s16le -ar 48000 -ac 2 -i merge.pcm out.mp3
```
## Thanks

Special thanks to [@eslachance](https://github.com/eslachance) for the [gist](https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba). It is what inspired me to make this repo.

