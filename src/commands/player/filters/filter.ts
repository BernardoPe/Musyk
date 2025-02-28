import { QueueMetadata, PlayerCommand, Config } from "../../../types.ts"
import { GuildQueue } from "discord-player"
import { sendEmbed } from "../../../utils/embeds/channels.ts"
import { GuildTextBasedChannel } from "discord.js"
import { errorEmbed, successEmbed } from "../../../utils/embeds/status.ts"

class FilterCommand implements PlayerCommand {
	public adminCommand: boolean = false
	public aliases: string[] = ["filter"]
	public name: string = "filter"
	public requiresPlayer: boolean = true
	public user: string | null = null
	public guild: string | null = null
	public msg: string | null = null

	public async execute(
		serverQueue: GuildQueue<QueueMetadata>,
		channel: GuildTextBasedChannel,
		args: string[],
		config: Config
	) {
		let filter = args[1]

		if (!filter.includes("bassboost")) {
			filter = "bassboost_low"
		}

		if (filter === "disableall") {
			await serverQueue.filters.ffmpeg.setFilters(false)
			const embed = successEmbed(null, config.lang.commands.filter.disabled_all)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (!serverQueue.filters.ffmpeg.isValidFilter(filter)) {
			const embed = errorEmbed(null, config.lang.commands.filter.invalid_filter)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		await serverQueue.filters.ffmpeg.toggle([filter])

		if (serverQueue.filters.ffmpeg.isEnabled(filter)) {
			const embed = successEmbed(null, config.lang.commands.filter.enabled_single.replace("{filter}", filter))
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const embed = successEmbed(null, config.lang.commands.filter.disabled_single.replace("{filter}", filter))
		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new FilterCommand()
