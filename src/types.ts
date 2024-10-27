import {
	ButtonInteraction,
	Client,
	GuildTextBasedChannel,
	InteractionCollector,
	Message,
	VoiceBasedChannel,
} from "discord.js"
import {GuildQueue, GuildQueueEvent, Player} from "discord-player"

interface MusicBot extends Client {
    player: Player;
}

interface GuildQueueEventHandler {
    name: GuildQueueEvent;
    execute: (...args: any) => void;
}

interface ClientEventHandler {
    name: string;
    execute: (...args: any) => void;
}

type ServerPrefix = string;

type Identifier = number;

interface Command {
    name: string;
    aliases: string[];
    adminCommand: boolean;
    requiresPlayer: boolean;
    user: string | null;
    msg: string | null;
    guild: string | null;
}

interface PlayerCommand extends Command {
    execute: (channel: GuildTextBasedChannel, args: string[], bot: MusicBot, serverQueue: GuildQueue<QueueMetadata>) => void;
}

interface TextCommand extends Command {
    execute: (msg: GuildMessage, args: string[], bot: MusicBot, serverQueue: GuildQueue<QueueMetadata> | null) => void;
}

type QueueMetadata = {
    voiceChannel: VoiceBasedChannel | null;
    textChannel: GuildTextBasedChannel | null;
    playerEmbed: Message | null;
    collector: InteractionCollector<ButtonInteraction> | null;
    updatingPlayer: boolean | null;
}

type GuildMessage = Message<true>

export { MusicBot, GuildQueueEventHandler, ClientEventHandler, ServerPrefix, Identifier, Command, QueueMetadata, GuildMessage, PlayerCommand, TextCommand }