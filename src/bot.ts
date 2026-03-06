import { Player } from "discord-player"
import { YoutubeiExtractor } from "discord-player-youtubei"
import { DeezerExtractor } from "discord-player-deezer"
import { Client, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import { getAllFiles } from "./utils/files/dir.ts"
import path from "node:path"
import { fileURLToPath, pathToFileURL } from "url"
import { logger } from "./utils/logger/logger.ts"
import { QueryCache } from "./QueryCache.ts"
import { SpotifyExtractor } from "discord-player-spotify"

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
		const currentFileDir = path.dirname(fileURLToPath(import.meta.url))
		const files = getAllFiles(path.join(currentFileDir, "listeners"))
		for (const file of files) {
			const fileUrl = pathToFileURL(file).href
			const module = await import(fileUrl)
			const event = module.default
			if (file.includes("player")) {
				this.player.events.on(event.name, (...args: any) => event.execute(...args, this))
				logger.info(`[LISTENER]: ${event.name} registered`)
			} else {
				this.client.on(event.name as keyof ClientEvents, (...args: any) => event.execute(...args, this))
				logger.info(`[LISTENER]: ${event.name} registered`)
			}
		}
	}

	private async registerCommands() {
		const commands: { [key: string]: BaseCommand } = {}
		const currentFileDir = path.dirname(fileURLToPath(import.meta.url))
		const commandsDir = path.join(currentFileDir, "commands")
		const commandFiles: string[] = getAllFiles(commandsDir)
		for (const file of commandFiles) {
			const fileUrl = pathToFileURL(file).href
			const module = await import(fileUrl)
			const command: BaseCommand = module.default
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
