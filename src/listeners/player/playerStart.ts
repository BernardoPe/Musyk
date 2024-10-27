import {GuildQueue} from "discord-player"
import {GuildQueueEventHandler, QueueMetadata} from "../../types.ts"
import {GuildQueueEvent} from "discord-player"
import {nowPlayingEmbed, createButtons, sendEmbed, updatePlayer} from "../../utils/embeds.ts"
import {ButtonInteraction, InteractionCollector, Message} from "discord.js"

class PlayerStartHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.playerStart

	public async execute(queue: GuildQueue<QueueMetadata>) {
		if (!queue.metadata.playerEmbed) {
			const embed = nowPlayingEmbed(queue)
			const buttons = createButtons()

			const data: Message | undefined = await sendEmbed(queue.metadata.textChannel!, {
				embeds: [embed],
				components: buttons,
			})

			const col = data ? data.createMessageComponentCollector() : null

			queue.setMetadata(
				{
					textChannel: queue.metadata.textChannel,
					voiceChannel: queue.metadata.voiceChannel,
					playerEmbed: data ? data : null,
					collector: col as InteractionCollector<ButtonInteraction> | null,
					updatingPlayer: queue.metadata.updatingPlayer,
				}
			)
		} else { updatePlayer(queue) }
	}
}

export default new PlayerStartHandler()