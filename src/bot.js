const { Player } = require("discord-player")
const {
	SpotifyExtractor,
	SoundCloudExtractor,
} = require("@discord-player/extractor")
const { YoutubeiExtractor, generateOauthTokens } = require("discord-player-youtubei")
const { Client, GatewayIntentBits } = require("discord.js")
const { addEventListeners } = require("./handlers/events.js")
const logger = require("./utils/logger.js").logger
require("dotenv").config()

// temp fix for youtubei.js logger warning, removed once fixed in youtubei.js
const youtubeiLogger = require("youtubei.js").Log 
youtubeiLogger.setLevel("NONE")

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

// generateOauthTokens() // Run this once to generate the necessary tokens

bot.player.extractors.register(YoutubeiExtractor, {
	authentication: process.env.ACCESS_TOKEN,
	overrideBridgeMode: "ytmusic",
})

bot.player.extractors.register(SpotifyExtractor, {})

bot.player.extractors.register(SoundCloudExtractor, {})

addEventListeners(bot)

bot.login(TOKEN)

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (error) => {
	console.error("There was an uncaught error", error, error.stack)
})

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise)
})
