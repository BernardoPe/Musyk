import { getAllFiles, getServerPrefix, getAdmins } from "../utils/configs.ts"
import { sendEmbed } from "../utils/embeds.ts"
import * as path from "path"
import { logger } from "../utils/logger.ts"
import { ButtonInteraction, GuildTextBasedChannel, Message } from "discord.js"
import { errorEmbed } from "../utils/embeds.ts"
import {
	TextCommand,
	Command,
	GuildMessage,
	MusicBot,
	PlayerCommand,
	QueueMetadata,
} from "../types.ts"
import { GuildQueue } from "discord-player"

const commands: { [key: string]: Command } = {}
const commandFiles: string[] = getAllFiles(path.join(__dirname, "../commands"))

commandFiles.forEach(async (file) => {
	const commandModule = await import(file)
	const command: Command = commandModule.default
	command.aliases.forEach((alias) => (commands[alias] = command))
})

export async function handleCommand(
	msg: GuildMessage | ButtonInteraction,
	args: string[],
	bot: MusicBot,
) {
	const prefix = getServerPrefix(msg.guild!.id)

	const messageContent = msg instanceof Message ? msg.content : msg.customId
	const user = msg instanceof Message ? msg.author : msg.user
	const channel: GuildTextBasedChannel = msg.channel as GuildTextBasedChannel

	if (!args[0].startsWith(prefix) || user.bot) return

	const commandName = args[0].slice(prefix.length).toLowerCase()

	if (commands[commandName]) {
		const command = commands[commandName]
		const serverQueue: GuildQueue<QueueMetadata> | null = bot.player.nodes.get(
      msg.guild!.id,
		)

		if (command.adminCommand) {
			const admins = getAdmins()
			if (!admins.includes(user.id)) return
		}

		if (command.requiresPlayer && (!serverQueue || !serverQueue.isPlaying())) {
			const embed = errorEmbed(null, "Not currently playing any songs")
			return sendEmbed(channel, { embeds: [embed] }, 20000)
		}

		command.msg = messageContent
		command.user = user.username
		command.guild = msg.guild!.name

		logger.info(
			`[COMMAND]: ${command.name} | ${command.msg} | User: ${command.user} | Guild: ${command.guild}`,
		)

		if (command.requiresPlayer) {
			(command as PlayerCommand).execute(channel, args, bot, serverQueue!)
		} else {
			(command as TextCommand).execute(
        msg as GuildMessage,
        args,
        bot,
        serverQueue,
			)
		}
	}
}
