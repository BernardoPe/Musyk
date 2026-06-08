import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { updatePlayer } from "@/embeds/player/playing.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

class RemoveCommand implements PlayerCommand {
	public aliases = ["remove"]
	public name = "remove"
	public requiresPlayer = true
	public adminCommand: boolean = false
	public execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, args, config } = ctx
		const value = Number.parseInt(args[1])
		if (Number.isNaN(value)) {
			const embed = errorEmbed(null, config.lang.commands.shared.value_must_be_number)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}
		const tracks = serverQueue.tracks.toArray()
		if (value < 1 || value > tracks.length) {
			const embed = errorEmbed(
				null,
				config.lang.commands.remove.invalid_index.replace("{queueLength}", tracks.length.toString())
			)
			sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
			return
		}
		const song = serverQueue.node.remove(tracks[value - 1])
		const embed = successEmbed(
			null,
			config.lang.commands.remove.removed.replace("{song}", `[${song!.title}](${song!.url})`)
		)
		updatePlayer(serverQueue, config.lang)
		sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

export default new RemoveCommand()
