import { BaseExtractor, GuildQueueEvent, Player } from "discord-player"
import { YoutubeExtractor, type YoutubeOptions } from "discord-player-youtubei"
import { DeezerExtractor } from "discord-player-deezer"
import { Client, GatewayIntentBits } from "discord.js"
import { Agent, setGlobalDispatcher } from "undici"
import { env } from "@/config/env.ts"
import { logger } from "@/utils/logger/logger.ts"
import { QueryCache } from "@/storage/queryCache.ts"
import { SpotifyExtractor } from "discord-player-spotify"
import { BotGuardSimplified } from "simple-ytdl-core"
import { clientListeners, playerListeners } from "@/listeners"
import { commandRegistry, slashRegistry } from "@/commands"

import type { ClientEvents } from "discord.js"
import type { Command, SlashCommand } from "@/types.ts"

// Extractors run in descending priority for search, bridging and stream fallback:
// YouTube first, Deezer as backup, Spotify (metadata only, bridged for playback) last.
const EXTRACTOR_PRIORITY = {
	youtube: 200,
	deezer: 100,
	spotify: 1,
} as const

// Commands usually arrive after the bot has been idle for a while. undici's default 4s
// keep-alive then costs a new TLS handshake to YouTube on every play (~150-185ms measured).
// Node's built-in fetch, used by youtubei.js, goes through this global dispatcher too.
const KEEP_ALIVE_TIMEOUT_MS = 60_000
const KEEP_ALIVE_MAX_TIMEOUT_MS = 600_000
setGlobalDispatcher(
	new Agent({ keepAliveTimeout: KEEP_ALIVE_TIMEOUT_MS, keepAliveMaxTimeout: KEEP_ALIVE_MAX_TIMEOUT_MS })
)

// Measured 2026-10-15: only the VISIONOS client and SABR return playable audio; every other
// client fails (403 or no formats) and peers/yt-dlp are not set up, so trying them only
// delays the fallback.
const YOUTUBE_OPTIONS = {
	downloads: {
		trialOrder: ["adaptive", "sabr"],
		adaptiveStream: {
			customClientOrder: [{ client: "VISIONOS", requirePoToken: false, requireDecipher: false }],
		},
	},
} satisfies YoutubeOptions

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
			// Any debug listener makes discord-player build debug strings on every operation.
			if (listener.name === GuildQueueEvent.Debug && !logger.isDebugEnabled()) continue
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
		const youtube = await this.registerExtractor(YoutubeExtractor, YOUTUBE_OPTIONS, EXTRACTOR_PRIORITY.youtube)
		// SABR (the YouTube fallback) needs a BotGuard session; creating it on demand adds
		// ~400ms to the first fallback, so build it in the background at startup.
		if (youtube.innertube) {
			BotGuardSimplified.create(youtube.innertube).catch((error) =>
				logger.warn(`[EXTRACTORS]: BotGuard warm-up failed: ${error instanceof Error ? error.message : error}`)
			)
		}
		await this.registerExtractor(
			DeezerExtractor,
			{ decryptionKey: env.KEY, arl: env.ARL },
			EXTRACTOR_PRIORITY.deezer
		)
		await this.registerExtractor(SpotifyExtractor, {}, EXTRACTOR_PRIORITY.spotify)
	}

	private async registerExtractor<O extends object, T extends typeof BaseExtractor<O>>(
		extractor: T,
		options: ConstructorParameters<T>[1],
		priority: number
	) {
		const instance = await this.player.extractors.register(extractor, options)
		if (!instance) throw new Error(`Extractor ${extractor.identifier} failed to activate`)
		instance.priority = priority
		logger.info(`[EXTRACTORS]: ${extractor.identifier} registered with priority ${priority}`)
		return instance
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
