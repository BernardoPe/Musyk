import type {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Client,
	Events,
	Guild,
	GuildMember,
	GuildTextBasedChannel,
	Message,
	User,
	VoiceBasedChannel,
} from "discord.js"
import { GuildQueue, GuildQueueEvent, Player } from "discord-player"
import type { Language } from "@/langs"

/**
 * Represents the discord bot client, extended with the discord-player player
 *
 * @see {@link https://discord.js.org/docs/packages/discord.js/14.16.3/Client:Class}
 *
 * @see {@link https://discord-player.js.org/docs/discord-player/class/Player}
 */
interface MusicBot {
	client: Client
	player: Player
	commands: { [key: string]: Command }
	slashCommands: { [key: string]: SlashCommand }
}

/**
 * Represents a guild queue event handler, which is used to handle events emitted by the discord-player server
 * queue
 *
 * @see {@link https://discord-player.js.org/docs/discord-player/class/GuildQueue}
 * @see {@link https://discord-player.js.org/docs/discord-player/type/GuildQueueEvents}
 */
interface GuildQueueEventHandler {
	name: GuildQueueEvent
	execute(...args: any[]): Promise<void> | void
}

/**
 * Represents a client event handler, which is used to handle events emitted by the discord bot client
 *
 * @see	{@link https://discord.js.org/docs/packages/discord.js/14.16.3/Client:Class}
 * @see	{@link https://discord.js.org/docs/packages/discord.js/14.16.3/ClientEvents:Interface}
 */
interface ClientEventHandler {
	name: Events
	execute(...args: any[]): Promise<void> | void
}

interface CommandBase {
	name: string
	aliases: string[]
	adminCommand: boolean
}

export interface CommandContext {
	bot: MusicBot
	guild: Guild
	channel: GuildTextBasedChannel
	user: User
	member: GuildMember | null
	args: string[]
	config: Config
	raw: string
	source: GuildMessage | ButtonInteraction
}

export interface PlayerCommandContext extends CommandContext {
	queue: GuildQueue<QueueMetadata>
}

export interface PlayerCommand extends CommandBase {
	requiresPlayer: true
	execute(ctx: PlayerCommandContext): Promise<void> | void
}

export interface BotCommand extends CommandBase {
	requiresPlayer: false
	execute(ctx: CommandContext): Promise<void> | void
}

export type Command = BotCommand | PlayerCommand

export type SlashCommandContext = {
	bot: MusicBot
	guild: Guild
	user: User
	config: Config
}

export interface SlashCommand {
	slashName: string
	executeSlash(interaction: ChatInputCommandInteraction, ctx: SlashCommandContext): Promise<void>
}

/**
 * Represents the queue metadata
 *
 * @param voiceChannel - The voice channel that the player is connected to
 * @param textChannel - The text channel that the player is connected to
 * @param playerEmbed - The message embed that displays the player
 * @param updatingPlayer - Whether the player is currently being updated
 */
type QueueMetadata = {
	voiceChannel: VoiceBasedChannel | null
	textChannel: GuildTextBasedChannel | null
	playerEmbed: Message | null
	updatingPlayer: boolean | null
}

/**
 * Represents the configuration for the player in a server
 *
 * @param searchEngine - The search engine used to search for tracks
 * @param volume - The volume of the player
 * @param leaveOnEnd - Whether the player should leave the voice channel when the queue ends
 * @param leaveOnEndCooldown - The cooldown before the player leaves the voice channel when the queue ends
 */
type PlayerConfig = {
	searchEngine: string
	volume: number
	leaveOnEnd: boolean
	leaveOnEndCooldown: number
}

/**
 * Represents the configuration information for a server
 *
 * @param prefix - The command prefix used by the server
 * @param lang - The language used in the server
 * @param playerConfig - The player configuration used in the server
 */
type Config = {
	prefix: string
	lang: Language
	playerConfig: PlayerConfig
}

/**
 * Represents a message in a server
 */
type GuildMessage = Message<true>

export type { MusicBot, GuildQueueEventHandler, ClientEventHandler, QueueMetadata, GuildMessage, Config, PlayerConfig }
