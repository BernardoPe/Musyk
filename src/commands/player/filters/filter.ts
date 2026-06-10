import { replyError, replySuccess } from "@/commands/validation.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class FilterCommand implements PlayerCommand {
	public adminCommand: boolean = false
	public aliases: string[] = ["filter"]
	public name: string = "filter"
	public readonly requiresPlayer = true as const
	public async execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		let filter = args[1]

		if (!filter) {
			return replyError(channel, config.lang.commands.filter.invalid_filter)
		}

		if (filter === "disableall") {
			await serverQueue.filters.ffmpeg.setFilters(false)
			return replySuccess(channel, config.lang.commands.filter.disabled_all)
		}

		if (!filter.includes("bassboost")) {
			filter = "bassboost_low"
		}

		if (!serverQueue.filters.ffmpeg.isValidFilter(filter)) {
			return replyError(channel, config.lang.commands.filter.invalid_filter)
		}

		await serverQueue.filters.ffmpeg.toggle([filter])

		if (serverQueue.filters.ffmpeg.isEnabled(filter)) {
			return replySuccess(channel, config.lang.commands.filter.enabled_single.replace("{filter}", filter))
		}

		replySuccess(channel, config.lang.commands.filter.disabled_single.replace("{filter}", filter))
	}
}

export default new FilterCommand()
