import { GuildQueue, SearchQueryType } from "discord-player"
import { logger } from "@/utils/logger/logger.ts"
import { replyError } from "@/commands/validation.ts"
import { YoutubeiExtractor } from "discord-player-youtubei"

import type { GuildTextBasedChannel, VoiceBasedChannel } from "discord.js"
import type { MusicBot, QueueMetadata, BotCommand, CommandContext, Config } from "@/types.ts"

class PlayCommand implements BotCommand {
	adminCommand: boolean = false
	aliases: string[] = ["p", "play"]
	name: string = "play"
	public readonly requiresPlayer = false as const
	private readonly searchEngines = {
		"-yt": "youtube",
		"-sp": "spotifySearch",
	}

	public async execute(ctx: CommandContext) {
		const { bot, channel, guild, member, user, config } = ctx
		let args = ctx.args

		if (args.length === 1) {
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

		const queue: GuildQueue<QueueMetadata> =
			bot.player.queues.get(guild.id) || this.createQueue(bot, channel, voiceChannel, config)

		if (queue.connection && queue.channel !== voiceChannel) {
			return replyError(channel, config.lang.commands.play.already_connected)
		}

		if (!queue.connection) {
			try {
				await queue.connect(voiceChannel)
			} catch (e) {
				bot.player.nodes.delete(guild.id)
				logger.error(e)
			}
		}

		args.shift()

		const searchArg = args.find((arg) => arg in this.searchEngines) as keyof typeof this.searchEngines | undefined

		const searchEngine = searchArg ? this.searchEngines[searchArg] : config.playerConfig.searchEngine

		args = args.filter((arg) => !(arg in this.searchEngines))

		const str = args.filter((arg) => arg.trim() !== "").join(" ")

		const engine = searchEngine === "youtube" ? `ext:${YoutubeiExtractor.identifier}` : searchEngine

		const result = await bot.player.search(str, {
			requestedBy: user,
			searchEngine: engine as SearchQueryType,
		})

		const song = result.tracks[0]

		if (result.tracks.length === 0) {
			return replyError(channel, config.lang.commands.play.no_results)
		}

		try {
			if (!queue.isPlaying() && !queue.dispatcher?.isBuffering()) {
				await queue.play(song)
			} else if (result.playlist) {
				queue.addTrack(result.playlist)
			} else {
				queue.addTrack(song)
			}
		} catch (e) {
			logger.error(e)
			replyError(channel, config.lang.commands.play.error)
		}
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
		})
		queue.metadata = {
			voiceChannel: voiceChannel,
			textChannel: channel,
			playerEmbed: null,
			updatingPlayer: false,
		}
		return queue as GuildQueue<QueueMetadata>
	}
}

export default new PlayCommand()
