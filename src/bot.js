const { Player } = require("discord-player")
const {
	SpotifyExtractor,
	SoundCloudExtractor,
} = require("@discord-player/extractor")
const { YoutubeiExtractor, generateOauthTokens, generateTrustedToken } = require("discord-player-youtubei")
const { Client, GatewayIntentBits } = require("discord.js")
const { addEventListeners } = require("./handlers/events.js")
const cron = require("node-cron")
require("dotenv").config()

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

const ppteerOpts = {
	puppeteerOptions: {
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--headless"
		]
	}
}

// generateOauthTokens() // Run this once to generate the necessary tokens
const tokens = generateTrustedToken(ppteerOpts)

bot.player.extractors.register(YoutubeiExtractor, {
	authentication: process.env.ACCESS_TOKEN,
	streamOptions: {
		useClient: "ANDROID"
	},
	trustedTokens: tokens
})

const task = async () => {
	const tokens = await generateTrustedToken(ppteerOpts)
	bot.player.extractors.get(YoutubeiExtractor).setTrustedTokens(tokens)
}

cron.schedule("0 0 * * 0", task)

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
