import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { updatePlayer } from "@/embeds/player/playing.ts"
import type { PlayerCommand, PlayerCommandContext } from "@/types.ts"

class ShuffleCommand implements PlayerCommand {
	public aliases = ["shuffle"]
	public name = "shuffle"
	public requiresPlayer = true
	public adminCommand: boolean = false
	execute(ctx: PlayerCommandContext) {
		const { queue: serverQueue, channel, config } = ctx
		if (serverQueue.tracks.size < 2) {
			const embed = errorEmbed(null, config.lang.commands.shuffle.not_enough_songs)
			sendEmbed(channel, { embeds: [embed] }, 20000)
			return
		}

		serverQueue.tracks.shuffle()

		updatePlayer(serverQueue, config.lang)

		const embed = successEmbed(null, config.lang.commands.shuffle.shuffled)

		sendEmbed(channel, { embeds: [embed] }, 20000)
	}
}

export default new ShuffleCommand()
