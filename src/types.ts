import {
	ButtonInteraction,
	Client,
	Events,
	GuildTextBasedChannel,
	InteractionCollector,
	Message,
	VoiceBasedChannel,
} from "discord.js"
import { GuildQueue, GuildQueueEvent, Player } from "discord-player"

/**
 * Represents the discord bot client, extended with the discord-player player
 *
 * @see {@link https://discord.js.org/docs/packages/discord.js/14.16.3/Client:Class}
 *
 * @see {@link https://discord-player.js.org/docs/discord-player/class/Player}
 */
interface MusicBot extends Client {
    player: Player
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
    execute: (...args: any) => void
}

/**
 * Represents a client event handler, which is used to handle events emitted by the discord bot client
 *
 * @see	{@link https://discord.js.org/docs/packages/discord.js/14.16.3/Client:Class}
 * @see	{@link https://discord.js.org/docs/packages/discord.js/14.16.3/ClientEvents:Interface}
 * @see {@link https://discord.js.org/docs/packages/discord.js/14.16.3/ClientEvents:Interface}
 */
interface ClientEventHandler {
    name: Events
    execute: (...args: any) => void
}

/**
 * Represents a server prefix, which is used to identify the prefix used by a specific server
 */
type ServerPrefix = string

/**
 * Represents a command in the application
 *
 * @param name - The name of the command
 * @param aliases - The aliases of the command, allowing the command to be executed using different names
 * @param adminCommand - Whether the command is an admin command, requiring the user to have admin permissions
 * @param requiresPlayer - Whether the command requires a player to exist for the server
 * @param msg - The message that triggered the command
 * @param guild - The guild that the command was triggered in
 * @param user - The user that triggered the command
 */
interface BaseCommand {
    name: string
    aliases: string[]
    adminCommand: boolean
    requiresPlayer: boolean
    user: string | null
    msg: string | null
    guild: string | null
}

/**
 * Represents a command that requires a player to exist for the server
 */
interface PlayerCommand extends BaseCommand {
    execute: (
        channel: GuildTextBasedChannel,
        args: string[],
        bot: MusicBot,
        serverQueue: GuildQueue<QueueMetadata>
    ) => void
}

/**
 * Represents a text command, that does not require a player to exist for the server
 */
interface TextCommand extends BaseCommand {
    execute: (
        msg: GuildMessage,
        args: string[],
        bot: MusicBot,
        serverQueue: GuildQueue<QueueMetadata> | null
    ) => void
}

/**
 * Represents the queue metadata
 *
 * @param voiceChannel - The voice channel that the player is connected to
 * @param textChannel - The text channel that the player is connected to
 * @param playerEmbed - The message embed that displays the player
 * @param collector - The interaction collector for the player embed
 * @param updatingPlayer - Whether the player is currently being updated
 */
type QueueMetadata = {
    voiceChannel: VoiceBasedChannel | null
    textChannel: GuildTextBasedChannel | null
    playerEmbed: Message | null
    collector: InteractionCollector<ButtonInteraction> | null
    updatingPlayer: boolean | null
}

/**
 * Represents a message in a server
 */
type GuildMessage = Message<true>

export {
	MusicBot,
	GuildQueueEventHandler,
	ClientEventHandler,
	ServerPrefix,
	BaseCommand,
	QueueMetadata,
	GuildMessage,
	PlayerCommand,
	TextCommand,
}
