import { Player } from "discord-player"
import { YoutubeiExtractor } from "discord-player-youtubei"
import { DeezerExtractor } from "discord-player-deezer"
import { Client, GatewayIntentBits } from "discord.js"
import { env } from "@/config/env.ts"
import { logger } from "@/utils/logger/logger.ts"
import { QueryCache } from "@/storage/queryCache.ts"
import { SpotifyExtractor } from "discord-player-spotify"
import { clientListeners, playerListeners } from "@/listeners"
import { commandRegistry, slashRegistry } from "@/commands"

import type { ClientEvents } from "discord.js"
import type { Command, SlashCommand } from "@/types.ts"

class MusicBot {
	client: Client
	player: Player
	commands: { [key: string]: Command } = {}
	slashCommands: { [key: string]: SlashCommand } = {}

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
		this.player = new Player(this.client, { skipFFmpeg: true, queryCache: new QueryCache() })
	}

	public async initialize() {
		await this.registerCommands()
		await this.registerExtractors()
		await this.addEventListeners()
		await this.client.login(env.TOKEN)
	}

	private async addEventListeners() {
		const guard =
			(listener: { name: string; execute: (...args: any[]) => Promise<void> | void }) =>
			async (...args: any[]) => {
				try {
					await listener.execute(...args, this)
				} catch (error) {
					logger.error(`[LISTENER:${listener.name}]: ${error instanceof Error ? error.stack : error}`)
				}
			}
		for (const listener of clientListeners) {
			this.client.on(listener.name as keyof ClientEvents, guard(listener))
			logger.info(`[LISTENER]: ${listener.name} registered`)
		}
		for (const listener of playerListeners) {
			this.player.events.on(listener.name, guard(listener))
			logger.info(`[LISTENER]: ${listener.name} registered`)
		}
	}

	private async registerCommands() {
		const commands: { [key: string]: Command } = {}
		for (const command of commandRegistry) {
			for (const alias of command.aliases) {
				commands[alias] = command
			}
			logger.info(`[COMMAND]: ${command.name} registered`)
		}
		this.commands = commands

		const slashCommands: { [key: string]: SlashCommand } = {}
		for (const command of slashRegistry) {
			slashCommands[command.slashName] = command
			logger.info(`[SLASH]: ${command.slashName} registered`)
		}
		this.slashCommands = slashCommands
	}

	private async registerExtractors() {
		await this.player.extractors.register(DeezerExtractor, {
			decryptionKey: env.KEY,
			arl: env.ARL,
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
	logger.error(`Uncaught exception: ${error?.stack ?? error}`)
})

process.on("unhandledRejection", (reason) => {
	logger.error(`Unhandled rejection: ${reason instanceof Error ? reason.stack : reason}`)
})

const bot = new MusicBot()

bot.initialize()
	.then(() => logger.info("Bot initialized"))
	.catch((error) => {
		logger.error(`Failed to initialize bot: ${error instanceof Error ? error.stack : error}`)
		process.exit(1)
	})

export default bot
