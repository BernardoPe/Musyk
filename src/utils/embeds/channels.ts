import { Collection, Colors, EmbedBuilder, GuildMember, GuildTextBasedChannel, Snowflake } from "discord.js"
import { logger } from "../logging/logger.ts"

const botID: string = process.env.BOT_ID!

function leftEmbed(): EmbedBuilder {
	return new EmbedBuilder().setDescription("Leaving the channel...").setColor(Colors.Red)
}

function sendEmbed(channel: GuildTextBasedChannel, info: any, timeout: number | null = null) {
	if (!channel) {
		logger.error("Channel not found")
		return
	}

	const members: Collection<Snowflake, GuildMember> = channel.members as Collection<Snowflake, GuildMember>
	const bot = members.get(botID)

	if (!bot) {
		logger.error("Bot not found in the channel")
		return
	}

	if (!channel.permissionsFor(bot).has("SendMessages")) {
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

export { sendEmbed, leftEmbed }
