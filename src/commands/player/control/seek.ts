import { sendEmbed } from "@/embeds/channels.ts"
import { successEmbed } from "@/embeds/status.ts"
import { validateTimestamp, millisecondsToTimestamp } from "@/utils/time.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class SeekCommand implements PlayerCommand {
	public aliases = ["seek"]
	public name = "seek"
	public requiresPlayer = true
	public adminCommand = false
	public async execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const time = validateTimestamp(args[1], serverQueue.node.totalDuration)

		if (time === false) {
			const embed = successEmbed(null, config.lang.commands.seek.invalid_time_format.replace("{time}", args[1]))
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		if (time === -1) {
			const embed = successEmbed(null, config.lang.commands.seek.invalid_time.replace("{time}", args[1]))
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		const dur = `${serverQueue.currentTrack!.duration.padStart(5, "0")}`

		await serverQueue.node.seek(time as number)

		const timestamp = millisecondsToTimestamp(time as number)

		const embed = successEmbed(null, config.lang.commands.seek.seeked.replace("{time}", timestamp + "/" + dur))

		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new SeekCommand()
