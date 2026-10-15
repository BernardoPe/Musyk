import { ButtonInteraction, Message } from "discord.js"
import { useQueue } from "discord-player"

import { sendEmbed } from "@/embeds/channels.ts"
import { logger } from "@/utils/logger/logger.ts"
import { errorEmbed } from "@/embeds/status.ts"
import { resolveConfig } from "@/storage/service.ts"
import { adminService } from "@/storage/services/admin.ts"
import { serverRepository } from "@/storage/repositories/server.ts"

import type { ChatInputCommandInteraction, GuildMember, GuildTextBasedChannel } from "discord.js"
import type { GuildQueue } from "discord-player"
import { EMBED_TIMEOUT_MS } from "@/constants.ts"
import type { CommandContext, Config, GuildMessage, MusicBot, QueueMetadata } from "@/types.ts"

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

	let config: Config | null = null
	try {
		config = await resolveConfig(user, guild)

		logger.info(`[COMMAND]: ${command.name} | ${raw} | User: ${user.username} | Guild: ${guild.name}`)

		const ctx: CommandContext = { bot, guild, channel, user, member, args, config, raw, source }

		if (command.requiresPlayer) {
			const queue = useQueue(guild.id) as GuildQueue<QueueMetadata> | null
			if (!queue || !queue.currentTrack) {
				const embed = errorEmbed(null, config.lang.shared.not_playing)
				void sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
				return
			}
			await command.execute({ ...ctx, queue })
			return
		}

		await command.execute(ctx)
	} catch (error) {
		logger.error(
			`[COMMAND]: ${command.name} failed | Guild: ${guild.id} | ${error instanceof Error ? error.stack : error}`
		)
		const message = config?.lang.shared.command_error ?? "An error occurred while executing the command"
		const embed = errorEmbed(null, message)
		void sendEmbed(channel, { embeds: [embed] }, EMBED_TIMEOUT_MS)
	}
}

async function handleMessageCommand(bot: MusicBot, msg: GuildMessage, args: string[]) {
	if (msg.author.bot || !args[0]) return
	// Only the server settings are needed to recognise a command; resolving the full config
	// here would create and cache a user row for every message author.
	const { prefix } = await serverRepository.getOrPut(msg.guild)
	if (!args[0].startsWith(prefix)) return
	const commandName = args[0].slice(prefix.length).toLowerCase()
	return dispatch(bot, commandName, args, msg, msg.content)
}

async function dispatchSlash(bot: MusicBot, interaction: ChatInputCommandInteraction) {
	const command = bot.slashCommands[interaction.commandName]
	if (!command) {
		logger.warn(`[SLASH]: Unknown command ${interaction.commandName}`)
		return
	}

	const guild = interaction.guild!
	const user = interaction.user

	let config: Config | null = null
	try {
		config = await resolveConfig(user, guild)

		logger.info(`[SLASH]: ${command.slashName} | User: ${user.username} | Guild: ${guild.name}`)

		await command.executeSlash(interaction, { bot, guild, user, config })
	} catch (error) {
		logger.error(
			`[SLASH]: ${command.slashName} failed | Guild: ${guild.id} | ${error instanceof Error ? error.stack : error}`
		)
		const message = config?.lang.shared.command_error ?? "An error occurred while executing the command"
		const embed = errorEmbed(null, message)
		const payload = { embeds: [embed], flags: "Ephemeral" as const }
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp(payload).catch(() => {})
		} else {
			await interaction.reply(payload).catch(() => {})
		}
	}
}

export { dispatch, dispatchSlash, handleMessageCommand }
