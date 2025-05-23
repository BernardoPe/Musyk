import { Player } from "discord-player"
import { DefaultExtractors } from "@discord-player/extractor"
import { YoutubeiExtractor } from "discord-player-youtubei"
import { Client, ClientEvents, GatewayIntentBits } from "discord.js"
import "dotenv/config"
import { BaseCommand } from "./types.ts"
import { getAllFiles } from "./Utils/Files/json.ts"
import path from "path"
import { logger } from "./Utils/Logging/logger.ts"
import { QueryCache } from "./QueryCache.ts"

class MusicBot {
	client: Client
	player: Player
	commands: { [key: string]: BaseCommand } = {}

	constructor(token?: string) {
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
		this.registerCommands()
			.then(() => this.registerExtractors())
			.then(() => this.addEventListeners())
			.then(() => this.client.login(token || process.env.TOKEN))
	}

	private async addEventListeners() {
		const files = getAllFiles(path.join(__dirname, "Listeners"))
		for (const file of files) {
			const module = await import(file)
			const event = module.default
			if (file.includes("Player")) {
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
		logger.info("[EXTRACTORS]: Youtubei extractor registered")
		await this.player.extractors.loadMulti(DefaultExtractors)
		logger.info("[EXTRACTORS]: Default extractors registered")
	}
}

process.on("uncaughtException", (error) => {
	console.error("There was an uncaught error", error, error.stack)
})

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise)
})

export default new MusicBot()
