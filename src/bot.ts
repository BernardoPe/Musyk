import { Player } from "discord-player"
import { YoutubeiExtractor } from "discord-player-youtubei"
import { DefaultExtractors, SpotifyExtractor as sp } from "@discord-player/extractor"
import { SpotifyExtractor } from "discord-player-spotify"
import { Client, ClientEvents, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import { BaseCommand } from "./types.ts"
import { getAllFiles } from "./utils/files/json.ts"
import path from "path"
import { logger } from "./utils/logger/logger.ts"
import { QueryCache } from "./QueryCache.ts"

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
		const files = getAllFiles(path.join(__dirname, "Listeners"))
		for (const file of files) {
			const module = await import(file)
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
		const commandFiles: string[] = getAllFiles(path.join(__dirname, "Commands"))
		for (const file of commandFiles) {
			const module = await import(file)
			const command: BaseCommand = module.default
			command.aliases.forEach((alias) => (commands[alias] = command))
			logger.info(`[COMMAND]: ${command.name} registered`)
		}
		this.commands = commands
	}

	private async registerExtractors() {
		await this.player.extractors.register(YoutubeiExtractor, {
			overrideBridgeMode: {
				youtubeVideo: "ytmusic",
				youtubePlaylist: "ytmusic",
				spotifySong: "ytmusic",
				spotifyAlbum: "ytmusic",
				spotifySearch: "yt",
				default: "yt",
			},
			generateWithPoToken: true,
		})
		await this.player.extractors.register(SpotifyExtractor, {})
		await this.player.extractors.loadMulti(DefaultExtractors)
		await this.player.extractors.unregister(sp.identifier)
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

;(async () => {
	await bot.initialize()
})()

export default bot
