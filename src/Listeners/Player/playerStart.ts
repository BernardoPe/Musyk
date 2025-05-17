import { GuildQueue } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { GuildQueueEvent } from "discord-player"
import { ButtonInteraction, InteractionCollector } from "discord.js"
import { createButtons } from "../../Embeds/Player/buttons.ts"
import { nowPlayingEmbed, updatePlayer } from "../../Embeds/Player/playing.ts"
import { sendEmbed } from "../../Embeds/channels.ts"
import { getOrCreateServerInfo } from "../../Storage/server.ts"

class PlayerStartHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerStart

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await getOrCreateServerInfo(queue.guild)
		if (!queue.metadata.playerEmbed) {
			const embed = nowPlayingEmbed(queue, server.lang)
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
				collector: col as InteractionCollector<ButtonInteraction> | null,
				updatingPlayer: queue.metadata.updatingPlayer,
			})
		} else {
			updatePlayer(queue, server.lang)
		}
	}
}

export default new PlayerStartHandler()
