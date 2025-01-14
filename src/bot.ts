import { Player } from "discord-player"
import { DefaultExtractors } from "@discord-player/extractor"
import { YoutubeiExtractor } from "discord-player-youtubei"
import { Client, GatewayIntentBits } from "discord.js"
import { addEventListeners } from "./handlers/events.ts"
import { MusicBot } from "./types.ts"
import "dotenv/config"
import { logger } from "./utils/logging/logger.ts"

const TOKEN = process.env.TOKEN

const bot: MusicBot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
	],
}) as MusicBot

bot.player = new Player(bot as Client, {
	skipFFmpeg: true,
})

addEventListeners(bot).then(async () => {
	await bot.player.extractors.register(YoutubeiExtractor, {
		overrideBridgeMode: "yt",
	})

	logger.info("Registered YoutubeiExtractor")

	await bot.player.extractors.loadMulti(DefaultExtractors)

	logger.info("Registered DefaultExtractors")

	await bot.login(TOKEN)
})

// generateOauthTokens() // Run this once to generate the necessary tokens

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (error) => {
	console.error("There was an uncaught error", error, error.stack)
})

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise)
})
