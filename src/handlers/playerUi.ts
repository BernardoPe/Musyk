import { Util } from "discord-player"
import { createButtons } from "@/embeds/player/buttons.ts"
import { nowPlayingEmbed } from "@/embeds/player/playing.ts"
import { sendEmbed } from "@/embeds/channels.ts"
import { logger } from "@/utils/logger/logger.ts"

import type { GuildQueue } from "discord-player"
import type { Language } from "@/langs"
import type { QueueMetadata } from "@/types.ts"

async function showPlayer(queue: GuildQueue<QueueMetadata>, lang: Language) {
	if (queue.metadata.playerEmbed) {
		refreshPlayer(queue, lang)
		return
	}
	const embed = nowPlayingEmbed(queue, lang)
	const buttons = createButtons()
	const data = await sendEmbed(queue.metadata.textChannel!, { embeds: [embed], components: buttons })
	queue.metadata.playerEmbed = data ?? null
}

function refreshPlayer(queue: GuildQueue<QueueMetadata>, lang: Language) {
	if (!queue.metadata.playerEmbed || queue.metadata.updatingPlayer || !queue.metadata.playerEmbed.editable) {
		return
	}

	queue.metadata.updatingPlayer = true

	const message = queue.metadata.playerEmbed
	const embed = nowPlayingEmbed(queue, lang)

	void message
		.edit({ embeds: [embed] })
		.catch(() => {})
		.finally(() => {
			queue.metadata.updatingPlayer = false
		})
}

async function destroyPlayer(queue: GuildQueue<QueueMetadata>, waitMs = 2000) {
	const deadline = Date.now() + waitMs
	while (queue.metadata.updatingPlayer && Date.now() < deadline) await Util.wait(5)
	if (queue.metadata.updatingPlayer) {
		logger.warn(`[PLAYER_UI]: timed out waiting for player update | Guild: ${queue.guild.id}`)
	}

	const message = queue.metadata.playerEmbed
	if (message) {
		await message.delete().catch(() => {})
		queue.metadata.playerEmbed = null
	}
}

export { showPlayer, refreshPlayer, destroyPlayer }
