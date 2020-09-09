# Discord Voice Recorder

A tiny [Discord.js](https://discord.js.org/#/) script that can record your voice calls. Jump to [Installation & Usage](https://github.com/sravanth-chebrolu/discord-voice-recorder#installation-and-usage) to learn how to run the script and save the audio to your local device.

<img src="https://i.imgur.com/y6JCNNA.png" width="400" align="center">

## Installation and Usage

### Installing

Download the ZIP file and extract the contents to a folder or just clone the repository to your local storage using this command:

```
git clone https://github.com/sravanth-chebrolu/discord-voice-recorder/
```

After extracting/cloning, run `npm i` to install the dependencies. **Ensure that you create a folder by the name** `recordings` **at the root directory.**

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

This will summon the bot into the voice channel mentioned in the arguments and start recording the audio, the audio will be saved to `~/recordings/AUDIO_FILE_NAME.pcm`.

#### Stop Recording

```
<PREFIX>exit <VOICE_CHANNEL_NAME>
```

This will remove the bot from the mentioned voice channel and the recording will stop. Note that if you re-summon the bot with the same file name, the new audio will be appended to the end of the provious file.
