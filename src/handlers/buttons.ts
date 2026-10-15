import { QueueRepeatMode, useQueue } from "discord-player"
import { dispatch } from "@/handlers/commands.ts"
import { logger } from "@/utils/logger/logger.ts"
import { MAX_VOLUME, MIN_VOLUME, VOLUME_STEP } from "@/constants.ts"
import { PLAYER_BUTTON_IDS } from "@/embeds/player/buttons.ts"

import type { ButtonInteraction } from "discord.js"
import type { GuildQueue } from "discord-player"
import type { MusicBot, QueueMetadata } from "@/types.ts"

function stepVolume(queue: GuildQueue<QueueMetadata>, direction: 1 | -1) {
	const volume = Math.min(MAX_VOLUME, Math.max(MIN_VOLUME, queue.node.volume + direction * VOLUME_STEP))
	queue.node.setVolume(volume)
}

async function handleButton(bot: MusicBot, interaction: ButtonInteraction) {
	const { customId } = interaction
	if (!PLAYER_BUTTON_IDS.has(customId)) return

	const queue = useQueue(interaction.guild!.id) as GuildQueue<QueueMetadata> | null
	if (!queue) return

	// Acknowledge in parallel instead of first: the round trip to Discord would otherwise
	// delay every button action. No command replies through the interaction itself.
	const acknowledged = interaction
		.deferUpdate()
		.catch((error) => logger.error(`[BUTTON]: deferUpdate failed for ${customId} | ${error}`))
	try {
		await runButton(bot, interaction, queue)
	} finally {
		await acknowledged
	}
}

async function runButton(bot: MusicBot, interaction: ButtonInteraction, queue: GuildQueue<QueueMetadata>) {
	const { customId } = interaction
	switch (customId) {
		case "increaseVolume":
			stepVolume(queue, 1)
			return
		case "decreaseVolume":
			stepVolume(queue, -1)
			return
		case "pause":
		case "resume": {
			const command = queue.dispatcher?.isPaused() ? "resume" : "pause"
			await dispatch(bot, command, [command], interaction, customId)
			return
		}
		case "cycle": {
			const mode = queue.repeatMode === QueueRepeatMode.TRACK ? "off" : "track"
			await dispatch(bot, "cycle", ["cycle", mode], interaction, customId)
			return
		}
		case "autoplay": {
			const mode = queue.repeatMode === QueueRepeatMode.AUTOPLAY ? "off" : "autoplay"
			await dispatch(bot, "cycle", ["cycle", mode], interaction, customId)
			return
		}
		default:
			await dispatch(bot, customId, [customId], interaction, customId)
	}
}

export { handleButton }
