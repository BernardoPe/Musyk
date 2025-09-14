import { GuildQueue, GuildQueueEvent } from "discord-player"
import { GuildQueueEventHandler, QueueMetadata } from "../../types.ts"
import { ButtonInteraction, InteractionCollector } from "discord.js"
import { createButtons } from "../../embeds/player/buttons.ts"
import { nowPlayingEmbed, updatePlayer } from "../../embeds/player/playing.ts"
import { sendEmbed } from "../../embeds/channels.ts"
import { serverRepository } from "../../storage/repositories/server.ts"

class PlayerStartHandler implements GuildQueueEventHandler {
	public name = GuildQueueEvent.PlayerStart

	public async execute(queue: GuildQueue<QueueMetadata>) {
		const server = await serverRepository.getOrPut(queue.guild)
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
				playerEmbed: data ?? null,
				collector: col as InteractionCollector<ButtonInteraction> | null,
				updatingPlayer: queue.metadata.updatingPlayer,
			})
		} else {
			updatePlayer(queue, server.lang)
		}
	}
}

export default new PlayerStartHandler()
