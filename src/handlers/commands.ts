import { sendEmbed } from "../utils/embeds/channels.ts"
import { logger } from "../utils/logging/logger.ts"
import { ButtonInteraction, GuildTextBasedChannel, Message } from "discord.js"
import { BotCommand, GuildMessage, MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"
import { GuildQueue, useQueue } from "discord-player"
import { errorEmbed } from "../utils/embeds/status.ts"
import { getAdmins, getServerPrefix } from "../utils/configs/server.ts"
import langs from "../langs"

export function handleCommand(msg: GuildMessage | ButtonInteraction, args: string[], bot: MusicBot) {
	const prefix = getServerPrefix(msg.guild!.id)

	const messageContent = msg instanceof Message ? msg.content : msg.customId
	const user = msg instanceof Message ? msg.author : msg.user
	const channel: GuildTextBasedChannel = msg.channel as GuildTextBasedChannel

	if (!args[0].startsWith(prefix) || user.bot) return

	const commandName = args[0].slice(prefix.length).toLowerCase()

	if (bot.commands[commandName]) {
		const command = bot.commands[commandName]
		const serverQueue: GuildQueue<QueueMetadata> | null = useQueue(msg.guild!.id)

		if (command.adminCommand) {
			const admins = getAdmins()
			if (!admins.includes(user.id)) return
		}

		command.msg = messageContent
		command.user = user.username
		command.guild = msg.guild!.name

		logger.info(`[COMMAND]: ${command.name} | ${command.msg} | User: ${command.user} | Guild: ${command.guild}`)

		if (command.requiresPlayer) {
			if (!serverQueue || !serverQueue.isPlaying()) {
				const embed = errorEmbed(null, langs.en.shared.not_playing)
				return sendEmbed(channel, { embeds: [embed] }, 20000)
			}
			(command as PlayerCommand).execute(serverQueue!, channel, args)
		} else {
			(command as BotCommand).execute(bot!, msg as GuildMessage, args)
		}
	}
}
