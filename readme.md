# Musyk :notes:


Musyk is a discord bot developed using the [discord-player](https://github.com/androz2091/discord-player) framework to play music on discord servers.


## Features :bulb:


- Music playback from YouTube, SoundCloud, and Spotify with search functionality and playlist support.
- Queue management with skip, pause, resume, and stop commands.
- Volume control
- Playback UI for ease of use and better user experience.
- Docker support for easy deployment.

## Installation :cd:


### Prerequisites :warning:

- [Node.js](https://nodejs.org/en) - The bot must be run in a Node.js environment. You can download Node.js [here](https://nodejs.org/en/download/). It is recommended to use the LTS
build available for your operating system.
- [FFmpeg](https://ffmpeg.org/) - The bot comes with the ffmpeg-static package which should allow the bot to run without any additional setup. However, you
can install your own version of FFmpeg [here](https://ffmpeg.org/download.html). To install FFmpeg, just download the binaries and
add the folder containing the binaries to your system's `PATH` environment variable.
- [Discord Account](https://discord.com) - You will need to register a bot on the Discord Developer site. To do this, go to the [Developer site](https://discord.com/developers/applications)
and click on the `New Application` button. Give your bot a name and click on the `Create` button. On the sidebar, click on the `Bot` tab and then click on the `Reset Token` button to get your bot's token.
This is the token that should be used in the `.ENV` file.

### Setup :wrench:

---

#### Regular installation

---

##### Basic setup
Download the .zip source code. Extract the contents of the .zip file and move on to the next step.

##### Git setup
If you have [Git](https://git-scm.com/) installed, you can clone the repository using the following command:
```git clone https://github.com/BernardoPe/Musyk.git```

##### Setup continuation
1. Open a terminal and navigate to the folder where the bot's files are located.
2. Run `npm install` to install the bot's dependencies.
3. Copy the `.env.example` file and rename it to `.env`.
Fill in the bot's token. Optionally, you can add your youtube access token. To do this, run the 
bot with line 40 of [bot.js](src/bot.js) uncommented. The bot will log the access tokens to the console. You can then copy and paste the access tokens into the `.env` file. 
4. Set your bot's config info in the [config.json](src/config.json) file. 
5. Run `npm start` to start the bot.

To create the bot's invite link, go to the [Discord Developer site](https://discord.com/developers/applications) and click on your bot's application. 

In the sidebar, you'll find the OAuth2 URL generator. Select the bot and applications.commands options. Once you select the bot option, a list of permissions will appear, allowing you to configure the permissions your bot needs.

After configuring the permissions, copy the generated URL and paste it into the [config.json](src/config.json) file, on the `inviteLink` field.

#### Docker installation

---

You can access the bot's Docker image on [Docker Hub](https://hub.docker.com/r/bernardope/musyk). 
To run the bot using this image, you can use the following command:
```
docker run -d \
--name musyk 
--env-file /path/to/.env \
--restart unless-stopped \
bernardope/musyk:latest
```
Alternatively, you can use the provided [Dockerfile](Dockerfile) to build the image yourself. 
Run the following command to build the image:
```
docker build -t musyk .
```
Then, you can run the image using the following command:
```
docker run -d \
--name musyk
--env-file /path/to/.env \
--restart unless-stopped \
musyk
```

Don't forget to fill in the `.env` file with the bot's token, and set the bot's config info in the [config.json](src/config.json) file.

## Support :rocket:



If you find any bugs or issues with the bot, feel free to open an issue on the [repository](https://github.com/BernardoPe/Musyk/issues/new) :thumbsup:

If you find this bot useful, consider giving it a :star:!
