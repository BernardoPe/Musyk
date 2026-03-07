import { Player } from "discord-player"
import { YoutubeiExtractor } from "discord-player-youtubei"
import { DeezerExtractor } from "discord-player-deezer"
import { Client, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import { logger } from "./utils/logger/logger.ts"
import { QueryCache } from "./QueryCache.ts"
import { SpotifyExtractor } from "discord-player-spotify"
import { clientListeners, playerListeners } from "./listeners"
import { commandRegistry } from "./commands"

import type { ClientEvents } from "discord.js"
import type { BaseCommand } from "./types.ts"

class MusicBot {
	client: Client
	player: Player
	commands: { [key: string]: BaseCommand } = {}

	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildVoiceStates,
			],
		})
		const cache = new QueryCache()
		this.player = new Player(this.client, { skipFFmpeg: true, queryCache: cache })
		cache.player = this.player
	}

	public async initialize() {
		await this.registerCommands()
		await this.registerExtractors()
		await this.addEventListeners()
		const token = process.env.TOKEN
		if (!token) {
			throw new Error("No TOKEN provided in environment variables")
		}
		await this.client.login(token)
	}

	private async addEventListeners() {
		for (const listener of clientListeners) {
			this.client.on(listener.name as keyof ClientEvents, (...args: any) => listener.execute(...args, this))
			logger.info(`[LISTENER]: ${listener.name} registered`)
		}
		for (const listener of playerListeners) {
			this.player.events.on(listener.name, (...args: any) => listener.execute(...args, this))
			logger.info(`[LISTENER]: ${listener.name} registered`)
		}
	}

	private async registerCommands() {
		const commands: { [key: string]: BaseCommand } = {}
		for (const command of commandRegistry) {
			for (const alias of command.aliases) {
				commands[alias] = command
			}
			logger.info(`[COMMAND]: ${command.name} registered`)
		}
		this.commands = commands
	}

	private async registerExtractors() {
		await this.player.extractors.register(DeezerExtractor, {
			decryptionKey: process.env.KEY!,
			arl: process.env.ARL!,
			priority: 100,
		})
		await this.player.extractors.register(YoutubeiExtractor, {
			useYoutubeDL: true,
			logLevel: "ALL",
		})
		await this.player.extractors.register(SpotifyExtractor, {})
		logger.info("[EXTRACTORS]: Youtubei extractor registered")
		logger.info("[EXTRACTORS]: Default extractors registered")
	}
}

process.on("uncaughtException", (error) => {
	console.error("There was an uncaught error", error, error.stack)
})

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise)
})

const bot = new MusicBot()

bot.initialize().then((_) => logger.info("Bot initialized"))

export default bot
