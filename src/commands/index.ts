import type { Command, SlashCommand } from "@/types.ts"

import disconnectCommand from "@/commands/disconnect.ts"
import helpCommand from "@/commands/help.ts"
import playCommand from "@/commands/player/play.ts"
import cycleCommand from "@/commands/player/control/cycle.ts"
import pauseCommand from "@/commands/player/control/pause.ts"
import resumeCommand from "@/commands/player/control/resume.ts"
import seekCommand from "@/commands/player/control/seek.ts"
import stopCommand from "@/commands/player/control/stop.ts"
import filterCommand from "@/commands/player/filters/filter.ts"
import analyticsCommand from "@/commands/player/info/analytics.ts"
import clearCommand from "@/commands/player/queue/clear.ts"
import jumpCommand from "@/commands/player/queue/jump.ts"
import queueCommand from "@/commands/player/queue/queue.ts"
import removeCommand from "@/commands/player/queue/remove.ts"
import reverseCommand from "@/commands/player/queue/reverse.ts"
import shuffleCommand from "@/commands/player/queue/shuffle.ts"
import skipCommand from "@/commands/player/queue/skip.ts"
import skipToCommand from "@/commands/player/queue/skipto.ts"
import swapCommand from "@/commands/player/queue/swap.ts"
import volumeCommand from "@/commands/player/volume/volume.ts"
import prefixCommand from "@/commands/settings/prefix.ts"
import languageCommand from "@/commands/settings/language.ts"

const commandRegistry: Command[] = [
	disconnectCommand,
	helpCommand,
	playCommand,
	cycleCommand,
	pauseCommand,
	resumeCommand,
	seekCommand,
	stopCommand,
	filterCommand,
	analyticsCommand,
	clearCommand,
	jumpCommand,
	queueCommand,
	removeCommand,
	reverseCommand,
	shuffleCommand,
	skipCommand,
	skipToCommand,
	swapCommand,
	volumeCommand,
]

const slashRegistry: SlashCommand[] = [helpCommand, prefixCommand, languageCommand]

export { commandRegistry, slashRegistry }
