import { ButtonInteraction, Message } from "discord.js"
import { useQueue } from "discord-player"

import { sendEmbed } from "@/embeds/channels.ts"
import { logger } from "@/utils/logger/logger.ts"
import { errorEmbed } from "@/embeds/status.ts"
import { getCommandInfo } from "@/storage/service.ts"
import { adminService } from "@/storage/services/admin.ts"

import type { GuildMember, GuildTextBasedChannel } from "discord.js"
import type { GuildQueue } from "discord-player"
import type {
	BotCommand,
	CommandContext,
	Config,
	GuildMessage,
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "@/types.ts"

async function dispatch(
	bot: MusicBot,
	commandName: string,
	args: string[],
	source: GuildMessage | ButtonInteraction,
	raw: string
) {
	const command = bot.commands[commandName]
	if (!command) return

	const user = source instanceof Message ? source.author : source.user
	if (user.bot) return

	const guild = source.guild!
	const channel = source.channel as GuildTextBasedChannel
	const member = source.member as GuildMember | null

	if (command.adminCommand && !adminService.isAdmin(user.id)) return

	const { userInfo, serverInfo } = await getCommandInfo(user, guild)
	const config: Config = {
		prefix: serverInfo.prefix,
		lang: serverInfo.lang,
		playerConfig: userInfo.playerConfig || serverInfo.playerConfig,
	}

	logger.info(`[COMMAND]: ${command.name} | ${raw} | User: ${user.username} | Guild: ${guild.name}`)

	const ctx: CommandContext = { bot, guild, channel, user, member, args, config, raw, source }

	if (command.requiresPlayer) {
		const queue = useQueue(guild.id) as GuildQueue<QueueMetadata> | null
		if (!queue?.isPlaying()) {
			const embed = errorEmbed(null, config.lang.shared.not_playing)
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}
		return (command as PlayerCommand).execute({ ...ctx, queue })
	}

	return (command as BotCommand).execute(ctx)
}

async function handleMessageCommand(bot: MusicBot, msg: GuildMessage, args: string[]) {
	if (msg.author.bot || !args[0]) return
	const { serverInfo } = await getCommandInfo(msg.author, msg.guild)
	if (!args[0].startsWith(serverInfo.prefix)) return
	const commandName = args[0].slice(serverInfo.prefix.length).toLowerCase()
	return dispatch(bot, commandName, args, msg, msg.content)
}

export { dispatch, handleMessageCommand }
