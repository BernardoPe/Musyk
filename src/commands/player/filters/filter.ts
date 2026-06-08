import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

class FilterCommand implements PlayerCommand {
	public adminCommand: boolean = false
	public aliases: string[] = ["filter"]
	public name: string = "filter"
	public requiresPlayer: boolean = true
	public async execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		let filter = args[1]

		if (!filter.includes("bassboost")) {
			filter = "bassboost_low"
		}

		if (filter === "disableall") {
			await serverQueue.filters.ffmpeg.setFilters(false)
			const embed = successEmbed(null, config.lang.commands.filter.disabled_all)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		if (!serverQueue.filters.ffmpeg.isValidFilter(filter)) {
			const embed = errorEmbed(null, config.lang.commands.filter.invalid_filter)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		await serverQueue.filters.ffmpeg.toggle([filter])

		if (serverQueue.filters.ffmpeg.isEnabled(filter)) {
			const embed = successEmbed(null, config.lang.commands.filter.enabled_single.replace("{filter}", filter))
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}

		const embed = successEmbed(null, config.lang.commands.filter.disabled_single.replace("{filter}", filter))
		sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

export default new FilterCommand()
