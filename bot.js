const { Player } = require("discord-player")
const {
	YouTubeExtractor,
	SpotifyExtractor,
	SoundCloudExtractor,
} = require("@discord-player/extractor")
const { Client, GatewayIntentBits } = require("discord.js")
const { addEventListeners } = require("./handlers/events.js")

require("dotenv").config()
const process = require("process")

//const access = fs.createWriteStream(`${__dirname}/LOG.log`)
//process.stdout.write = process.stderr.write = access.write.bind(access)

const TOKEN = process.env.TOKEN

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
})

bot.player = new Player(bot, {
	ytdlOptions: {
		quality: "highestaudio",
		filter: "audioonly",
		requestOptions: {
			headers: {
				cookie: process.env.COOKIE,
			},
		},
	},
	skipFFmpeg: true
})

//console.log(bot.player.scanDeps())

bot.player.extractors.register(YouTubeExtractor)
bot.player.extractors.register(SpotifyExtractor)
bot.player.extractors.register(SoundCloudExtractor)

addEventListeners(bot)

bot.login(TOKEN)
