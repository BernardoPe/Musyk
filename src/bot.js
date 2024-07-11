const { Player } = require("discord-player")
const {
	YouTubeExtractor,
	SpotifyExtractor,
	SoundCloudExtractor,
} = require("@discord-player/extractor")
const { YoutubeiExtractor, createYoutubeiStream, generateOauthTokens } = require("discord-player-youtubei")
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
	skipFFmpeg: true
})

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (error) => {
	console.error("There was an uncaught error", error)
})

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason)
})

// console.log(bot.player.scanDeps())

// generateOauthTokens() // Run this once to generate the necessary tokens

bot.player.extractors.register(YoutubeiExtractor, {
	authentication: {
		access_token: process.env.ACCESS_TOKEN,
		refresh_token: process.env.REFRESH_TOKEN,
		scope: "https://www.googleapis.com/auth/youtube-paid-content https://www.googleapis.com/auth/youtube",
		token_type: "Bearer",
		expiry_date: "2024-07-12T18:08:27.305Z"
	}
})

bot.player.extractors.register(YouTubeExtractor, {
	createStream: createYoutubeiStream
})

bot.player.extractors.register(SpotifyExtractor, {
	createStream: createYoutubeiStream
})

bot.player.extractors.register(SoundCloudExtractor, {
	createStream: createYoutubeiStream
})

addEventListeners(bot)

bot.login(TOKEN)
