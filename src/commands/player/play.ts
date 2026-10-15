import { GuildQueue, QueryType } from "discord-player"
import { DeezerExtractor } from "discord-player-deezer"
import { SpotifyExtractor } from "discord-player-spotify"
import { YoutubeExtractor } from "discord-player-youtubei"
import { logger } from "@/utils/logger/logger.ts"
import { replyError } from "@/commands/validation.ts"
import { prefetchTrack, takePrefetched } from "@/handlers/prefetch.ts"

import type { QueryExtractorSearch, SearchQueryType, SearchResult } from "discord-player"
import type { GuildTextBasedChannel, User, VoiceBasedChannel } from "discord.js"
import type { MusicBot, QueueMetadata, BotCommand, CommandContext, Config } from "@/types.ts"

type SearchEngine = SearchQueryType | QueryExtractorSearch

const YOUTUBE_ENGINE: QueryExtractorSearch = `ext:${YoutubeExtractor.identifier}`
const DEEZER_ENGINE: QueryExtractorSearch = `ext:${DeezerExtractor.identifier}`

const SEARCH_ENGINE_FLAGS: Record<string, SearchEngine> = {
	"-yt": YOUTUBE_ENGINE,
	"-sp": `ext:${SpotifyExtractor.identifier}`,
}

const DEEZER_HOST = /(^|\.)deezer\.com$|^deezer\.page\.link$/

// discord-player-deezer's validate() only matches track URLs, so playlist and album links
// would find no extractor. Send every Deezer link to it explicitly.
function isDeezerUrl(query: string): boolean {
	return URL.canParse(query) && DEEZER_HOST.test(new URL(query).hostname)
}

const ms = (value: number) => `${Math.round(value)}ms`

const pendingConnections = new WeakMap<GuildQueue<QueueMetadata>, Promise<boolean>>()

/**
 * Connects the queue to the voice channel unless it already is connected. Concurrent
 * commands share one attempt so they do not create competing voice connections.
 */
function ensureConnected(queue: GuildQueue<QueueMetadata>, voiceChannel: VoiceBasedChannel): Promise<boolean> {
	if (queue.connection) return Promise.resolve(true)
	let pending = pendingConnections.get(queue)
	if (!pending) {
		pending = queue
			.connect(voiceChannel)
			.then(
				() => true,
				(e) => {
					logger.error(e)
					return false
				}
			)
			.finally(() => pendingConnections.delete(queue))
		pendingConnections.set(queue, pending)
	}
	return pending
}

class PlayCommand implements BotCommand {
	adminCommand: boolean = false
	aliases: string[] = ["p", "play"]
	name: string = "play"
	public readonly requiresPlayer = false as const

	public async execute(ctx: CommandContext) {
		const { bot, channel, guild, member, user, config } = ctx
		const startedAt = performance.now()

		const terms = ctx.args.slice(1).filter((arg) => arg.trim() !== "")
		const flag = terms.find((arg) => arg in SEARCH_ENGINE_FLAGS)
		const query = terms.filter((arg) => !(arg in SEARCH_ENGINE_FLAGS)).join(" ")

		if (!query) {
			return replyError(channel, config.lang.commands.play.provide_search)
		}

		const voiceChannel = member?.voice.channel

		if (!voiceChannel) {
			return replyError(channel, config.lang.commands.play.need_to_be_in_voice)
		}

		const botUser = bot.client.user
		const permissions = botUser && voiceChannel.permissionsFor(botUser)

		if (!permissions || !permissions.has("Connect") || !permissions.has("Speak")) {
			return replyError(channel, config.lang.commands.play.need_permissions)
		}

		const existingQueue = bot.player.queues.get<QueueMetadata>(guild.id)

		if (existingQueue?.connection && existingQueue.channel !== voiceChannel) {
			return replyError(channel, config.lang.commands.play.already_connected)
		}

		const engine = flag
			? SEARCH_ENGINE_FLAGS[flag]
			: isDeezerUrl(query)
				? DEEZER_ENGINE
				: (config.playerConfig.searchEngine as SearchQueryType)

		const queue = existingQueue ?? this.createQueue(bot, channel, voiceChannel, config)
		// Join voice while searching: the two are independent and each takes hundreds of ms.
		const connecting = ensureConnected(queue, voiceChannel)

		let result: SearchResult
		try {
			result = await this.search(bot, query, engine, user)
		} catch (e) {
			await this.leaveIfIdle(queue, connecting)
			throw e
		}
		const searchedAt = performance.now()

		if (result.isEmpty()) {
			await this.leaveIfIdle(queue, connecting)
			return replyError(channel, config.lang.commands.play.no_results)
		}

		// An idle queue will start with this track: extract its stream while voice still connects.
		if (!queue.isPlaying() && queue.isEmpty()) prefetchTrack(queue, result.tracks[0])

		if (!(await connecting)) {
			queue.delete()
			return replyError(channel, config.lang.commands.play.error)
		}
		const connectedAt = performance.now()

		if (!queue.isPlaying()) queue.metadata.playRequestedAt = startedAt

		try {
			// Adds the whole playlist when there is one and starts playback if idle,
			// serialized per guild by discord-player's task queue.
			await queue.play(result)
			logger.info(
				`[PLAY]: search=${ms(searchedAt - startedAt)} connect wait after search=${ms(connectedAt - searchedAt)} ` +
					`play=${ms(performance.now() - connectedAt)} | Guild: ${guild.id}`
			)
		} catch (e) {
			logger.error(e)
			replyError(channel, config.lang.commands.play.error)
		}
	}

	/** Leaves again when this command joined voice only to find nothing to play. */
	private async leaveIfIdle(queue: GuildQueue<QueueMetadata>, connecting: Promise<boolean>) {
		await connecting
		if (!queue.deleted && !queue.isPlaying() && queue.isEmpty()) queue.delete()
	}

	/**
	 * Searches with the given engine. Plain-text searches that YouTube cannot answer
	 * fall back to Deezer.
	 */
	private async search(bot: MusicBot, query: string, engine: SearchEngine, user: User): Promise<SearchResult> {
		const result = await bot.player.search(query, { requestedBy: user, searchEngine: engine })
		const youtubeSearch = engine === QueryType.AUTO || engine === YOUTUBE_ENGINE
		if (!result.isEmpty() || !youtubeSearch || URL.canParse(query)) return result

		logger.info(`[PLAY]: No YouTube results for "${query}", falling back to Deezer`)
		return bot.player.search(query, { requestedBy: user, searchEngine: DEEZER_ENGINE })
	}

	private createQueue(
		bot: MusicBot,
		channel: GuildTextBasedChannel,
		voiceChannel: VoiceBasedChannel,
		config: Config
	): GuildQueue<QueueMetadata> {
		const queue = bot.player.nodes.create(channel.guild, {
			bufferingTimeout: 20000,
			leaveOnEmpty: false,
			volume: config.playerConfig.volume,
			leaveOnEnd: config.playerConfig.leaveOnEnd,
			leaveOnEndCooldown: config.playerConfig.leaveOnEndCooldown,
			onBeforeCreateStream: (track, _queryType, queue) => takePrefetched(queue, track),
			// No command uses these PCM stages; the flat equalizer alone cost ~1.5% of a core per
			// playing guild. Filters are applied through ffmpeg. disableFilterer must stay off: it
			// skips the whole PCM chain, volume included.
			disableEqualizer: true,
			disableBiquad: true,
			disableResampler: true,
		})
		queue.metadata = {
			voiceChannel: voiceChannel,
			textChannel: channel,
			playerEmbed: null,
			updatingPlayer: false,
			playRequestedAt: null,
		}
		return queue as GuildQueue<QueueMetadata>
	}
}

export default new PlayCommand()
