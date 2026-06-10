import { sendEmbed } from "@/embeds/channels.ts"
import { errorEmbed, successEmbed } from "@/embeds/status.ts"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"

import type { GuildTextBasedChannel } from "discord.js"

function parseIntInRange(raw: string, min: number, max: number): number | null {
	const value = Number.parseInt(raw)
	if (Number.isNaN(value) || value < min || value > max) return null
	return value
}

function replyError(channel: GuildTextBasedChannel, message: string): void {
	const embed = errorEmbed(null, message)
	void sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
}

function replySuccess(channel: GuildTextBasedChannel, message: string): void {
	const embed = successEmbed(null, message)
	void sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
}

export { parseIntInRange, replyError, replySuccess }
