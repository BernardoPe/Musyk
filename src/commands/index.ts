import type { BaseCommand } from "../types.ts"

import disconnectCommand from "./disconnect.ts"
import helpCommand from "./help.ts"
import playCommand from "./player/play.ts"
import cycleCommand from "./player/control/cycle.ts"
import pauseCommand from "./player/control/pause.ts"
import resumeCommand from "./player/control/resume.ts"
import seekCommand from "./player/control/seek.ts"
import stopCommand from "./player/control/stop.ts"
import filterCommand from "./player/filters/filter.ts"
import analyticsCommand from "./player/info/analytics.ts"
import clearCommand from "./player/queue/clear.ts"
import jumpCommand from "./player/queue/jump.ts"
import queueCommand from "./player/queue/queue.ts"
import removeCommand from "./player/queue/remove.ts"
import reverseCommand from "./player/queue/reverse.ts"
import shuffleCommand from "./player/queue/shuffle.ts"
import skipCommand from "./player/queue/skip.ts"
import skipToCommand from "./player/queue/skipto.ts"
import swapCommand from "./player/queue/swap.ts"
import volumeCommand from "./player/volume/volume.ts"

const commandRegistry: BaseCommand[] = [
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

export { commandRegistry }
