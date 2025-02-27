import { MusicBot, QueueMetadata, BotCommand, GuildMessage } from "../../types.ts"

import { sendEmbed } from "../../utils/embeds/channels.ts"
import { GuildQueue, SearchQueryType } from "discord-player"
import { GuildTextBasedChannel, VoiceBasedChannel } from "discord.js"
import { logger } from "../../utils/logging/logger.ts"
import { errorEmbed } from "../../utils/embeds/status.ts"
import { Language } from "../../langs"

class PlayCommand implements BotCommand {
	adminCommand: boolean = false
	aliases: string[] = ["p", "play"]
	name: string = "play"
	requiresPlayer: boolean = false
	user: string | null = null
	msg: string | null = null
	guild: string | null = null

	private searchEngines = {
		"-sp": "spotifySearch",
		"-yt": "youtube",
		"-sc": "soundcloudSearch",
	}

	public async execute(bot: MusicBot, msg: GuildMessage, args: string[], lang: Language) {
		const { channel } = msg

		if (args.length === 1) {
			const embed = errorEmbed(null, lang.commands.play.provide_search)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const voiceChannel = msg.member!.voice.channel

		if (!voiceChannel) {
			const embed = errorEmbed(null, lang.commands.play.need_to_be_in_voice)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const permissions = voiceChannel.permissionsFor(msg.client.user)!

		if (!permissions.has("Connect") || !permissions.has("Speak")) {
			const embed = errorEmbed(null, lang.commands.play.need_permissions)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const queue: GuildQueue<QueueMetadata> =
            bot.player.queues.get(msg.guild.id) || this.createQueue(bot, channel, voiceChannel)

		if (queue.connection && queue.channel !== msg.member!.voice.channel) {
			const embed = errorEmbed(null, lang.commands.play.already_connected)
			sendEmbed(msg.channel, { embeds: [embed] }, 20000)
			return
		}

		if (!queue.connection) {
			try {
				await queue.connect(voiceChannel)
			} catch (e) {
				bot.player.nodes.delete(msg.guild.id)
				logger.error(e)
			}
		}

		args.shift() // Remove the command from the args

		const searchArg = args.find((arg) => arg in this.searchEngines) as keyof typeof this.searchEngines | undefined

		const searchEngine = searchArg ? this.searchEngines[searchArg] : "auto"

		args = args.filter((arg) => !(arg in this.searchEngines))

		const str = args.filter((arg) => arg.trim() !== "").join(" ")

		const result = await bot.player.search(str, {
			requestedBy: msg.author,
			searchEngine: searchEngine as SearchQueryType,
		})

		const song = result.tracks[0]

		if (result.tracks.length === 0) {
			const embed = errorEmbed(null, lang.commands.play.no_results)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		try {
			if (!queue.isPlaying() && !queue.dispatcher!.isBuffering()) {
				await queue.play(song)
			} else if (!result.playlist) {
				queue.addTrack(song)
			} else {
				queue.addTrack(result.playlist)
			}
		} catch (e) {
			logger.error(e)
			const embed = errorEmbed(null, lang.commands.play.error)
			sendEmbed(channel, { embeds: [embed] }, 20000)
		}
	}

	private createQueue(
		bot: MusicBot,
		channel: GuildTextBasedChannel,
		voiceChannel: VoiceBasedChannel
	): GuildQueue<QueueMetadata> {
		const queue = bot.player.nodes.create(channel.guild, {
			bufferingTimeout: 20000,
			leaveOnEmpty: false,
			leaveOnEnd: true,
			leaveOnEndCooldown: 300000,
			disableHistory: true,
		})
		queue.metadata = {
			voiceChannel: voiceChannel,
			textChannel: channel,
			playerEmbed: null,
			collector: null,
			updatingPlayer: false,
		}
		return queue as GuildQueue<QueueMetadata>
	}
}

export default new PlayCommand()
