import { Collection, Colors, EmbedBuilder, GuildMember, GuildTextBasedChannel, Snowflake } from "discord.js"
import { logger } from "../Utils/Logging/logger.ts"
import { Language } from "../Langs"
import bot from "../bot.ts"

function leftEmbed(lang: Language): EmbedBuilder {
	return new EmbedBuilder().setDescription(lang.embeds.left.description).setColor(Colors.Red)
}

function sendEmbed(channel: GuildTextBasedChannel, info: any, timeout: number | null = null) {
	if (!channel) {
		logger.error("Channel not found")
		return
	}

	const members: Collection<Snowflake, GuildMember> = channel.members as Collection<Snowflake, GuildMember>
	const botPresent = members.get(bot.client.application?.id as Snowflake)

	if (!botPresent) {
		logger.error("Bot not found in the channel")
		return
	}

	if (!channel.permissionsFor(botPresent).has("SendMessages")) {
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
