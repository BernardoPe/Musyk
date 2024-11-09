import { GuildQueue } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { GuildQueueEvent } from "discord-player"
import { ButtonInteraction, InteractionCollector } from "discord.js"
import { createButtons } from "../../utils/embeds/buttons.ts"
import {
	nowPlayingEmbed,
	updatePlayer,
} from "../../utils/embeds/player/playing.ts"
import { sendEmbed } from "../../utils/embeds/channels.ts"

class PlayerStartHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.playerStart

	public async execute(queue: GuildQueue<QueueMetadata>) {
		if (!queue.metadata.playerEmbed) {
			const embed = nowPlayingEmbed(queue)
			const buttons = createButtons()

			const data = await sendEmbed(queue.metadata.textChannel!, {
				embeds: [embed],
				components: buttons,
			})

			const col = data ? data.createMessageComponentCollector() : null

			queue.setMetadata({
				textChannel: queue.metadata.textChannel,
				voiceChannel: queue.metadata.voiceChannel,
				playerEmbed: data ? data : null,
				collector:
                    col as InteractionCollector<ButtonInteraction> | null,
				updatingPlayer: queue.metadata.updatingPlayer,
			})
		} else {
			updatePlayer(queue)
		}
	}
}

export default new PlayerStartHandler()
