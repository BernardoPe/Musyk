import { sendEmbed } from "../utils/embeds/channels.ts"
import { logger } from "../utils/logging/logger.ts"
import { ButtonInteraction, GuildTextBasedChannel, Message } from "discord.js"
import { BotCommand, Config, GuildMessage, MusicBot, PlayerCommand, QueueMetadata } from "../types.ts"

import { GuildQueue, useQueue } from "discord-player"
import { errorEmbed } from "../utils/embeds/status.ts"
import { getCommandInfo } from "../utils/db/service.ts"
import { getAdmins } from "../utils/db/server.ts"

export async function handleCommand(msg: GuildMessage | ButtonInteraction, args: string[], bot: MusicBot) {
	const messageContent = msg instanceof Message ? msg.content : msg.customId
	const user = msg instanceof Message ? msg.author : msg.user
	const channel: GuildTextBasedChannel = msg.channel as GuildTextBasedChannel
	const { userInfo, serverInfo } = await getCommandInfo(user, msg.guild!)

	if (!args[0].startsWith(serverInfo.prefix) || user.bot) return

	const commandName = args[0].slice(serverInfo.prefix.length).toLowerCase()

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

		const configInfo: Config = {
			prefix: serverInfo.prefix,
			lang: serverInfo.lang,
			playerConfig: userInfo.playerConfig || serverInfo.playerConfig!,
		}

		if (command.requiresPlayer) {
			if (!serverQueue || !serverQueue.isPlaying()) {
				const embed = errorEmbed(null, configInfo.lang.shared.not_playing)
				return sendEmbed(channel, { embeds: [embed] }, 20000)
			}
			(command as PlayerCommand).execute(serverQueue!, channel, args, configInfo)
		} else {
			(command as BotCommand).execute(bot!, msg as GuildMessage, args, configInfo)
		}
	}
}
