# Discord Voice Recorder

A tiny [Discord.js](https://discord.js.org/#/) script that can record your voice calls. Jump to [Installation & Usage](https://github.com/sravanth-chebrolu/discord-voice-recorder#installation-and-usage) to learn how to run the script and save the audio to your local device.

<img src="https://i.imgur.com/y6JCNNA.png" width="400" align="center">

### Content

-    [Installation and Usage](#installation-and-usage)
     -    [Installing](#installing)
     -    [Setting Up the Local Environment](#setting-up-the-local-environment)
     -    [Running the Script](#running-the-script)
          -    [Start Recording](#start-recording)
          -    [Stop Recording](#stop-recording)
-    [Thanks](#thanks)

## Installation and Usage

### Installing the Source Code

Download the ZIP file and extract the contents to a folder or just clone the repository to your local storage using this command:

```
git clone https://github.com/sravanth-chebrolu/discord-voice-recorder/
```

After extracting/cloning, run `npm i` to install the dependencies. **Ensure that you create a folder by the name** `recordings` **at the root directory.**

Next head over to the [FFmpeg.org](https://ffmpeg.org/download.html), and download the executables depending on your OS; If you're on Windows ensure sure that you have included the path to the bin folder to your system enviroment PATH variables. Ex: `C:\Programs\ffmpeg\ffmpeg-20200831-4a11a6f-win64-static\bin`.

### Setting Up the Local Environment

To run this script locally you will need to [create a discord bot](https://discordpy.readthedocs.io/en/latest/discord.html) first. After creating it invite the bot to your server(to avoid potential problems, it is recommended that the bot be given adminstrator privilege when creating the initve link). Follow the next steps to finish the setup:

1. Create a `config.json` file at the root directory.
2. Copy the the bot token from the [developer window](https://discord.com/developers/applications).
3. Choose a prefix you want the bot to answer to.

Paste the bot token and the prefix value so your config.json will look like this:

```
{
    "BOT_TOKEN": "<your-bot-token>",
    "PREFIX": "<your-prefix>"
}
```

And you're all set. Note that all your recordings will be saved to `~/recordings/` if `~` is the root directory.

### Running the Script

To run the script just run:

```
npm start
```

The bot should be online and you can run the bot commands in your discord server. There are only two commands currently,

#### Start Recording

```
<PREFIX>enter <VOICE_CHANNEL_NAME> <AUDIO_FILE_NAME>
```

This will summon the bot into the voice channel mentioned in the arguments and start recording the audio. You will hear a 'ding' when you run the command indicating that the connection has been established. If you don't hear the 'ding', there's a problem with the ffmpeg installation. Keep in mind that the audio will be recorded in the [PCM format](https://en.wikipedia.org/wiki/Pulse-code_modulation) and will be saved to `~/recordings/AUDIO_FILE_NAME.pcm`.

> To work with PCM audio, you could use software such as [Audacity](https://www.audacityteam.org/). To import the audio into Audacity, open File > Import > Raw Data... and then select your audio file. You should select Signed 16-bit PCM as the encoding, a Little-endian byte order, 2 Channels (Stereo) and a sample rate of 48000Hz.

#### Stop Recording

```
<PREFIX>exit <VOICE_CHANNEL_NAME>
```

This will remove the bot from the mentioned voice channel and the recording will stop. Note that if you re-summon the bot with the same file name, the new audio will be appended to the end of the provious file.

# Thanks

Also, thanks @eslachance for the gist, which is what this code is based on. https://gist.github.com/eslachance/fb70fc036183b7974d3b9191601846ba.
