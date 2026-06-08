import { logger } from "@/utils/logger/logger.ts"

import type { GuildTextBasedChannel, MessageCreateOptions, MessagePayload } from "discord.js"

function sendEmbed(
	channel: GuildTextBasedChannel,
	info: string | MessagePayload | MessageCreateOptions,
	timeout: number | null = null
) {
	if (!channel) {
		logger.error("Channel not found")
		return
	}

	const botMember = channel.guild.members.me

	if (!botMember) {
		logger.error("Bot not found in the channel")
		return
	}

	if (!channel.permissionsFor(botMember).has("SendMessages")) {
		logger.error("Bot doesn't have permission to send messages")
		return
	}

	return channel.send(info).then((msg) => {
		if (timeout) {
			setTimeout(() => {
				msg.delete()
			}, timeout)
		}
		return msg
	})
}

export { sendEmbed }
