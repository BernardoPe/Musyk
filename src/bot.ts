import { Player } from "discord-player"
import { SpotifyExtractor, SoundCloudExtractor } from "@discord-player/extractor"
import { YoutubeiExtractor} from "discord-player-youtubei"
import { Client, GatewayIntentBits } from "discord.js"
import { addEventListeners } from "./handlers/events.ts"
import { MusicBot } from "./types.ts"
import "dotenv/config"

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

// generateOauthTokens() // Run this once to generate the necessary tokens

bot.player.extractors.register(YoutubeiExtractor, {
	authentication: process.env.ACCESS_TOKEN,
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
