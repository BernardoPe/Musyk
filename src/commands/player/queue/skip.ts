import { GuildQueue } from "discord-player"

import type { QueueMetadata, PlayerCommand } from "../../../types.ts"

class SkipCommand implements PlayerCommand {
	aliases = ["skip"]
	name = "skip"
	requiresPlayer = true
	adminCommand = false
	user = null
	guild = null
	msg = null

	execute(serverQueue: GuildQueue<QueueMetadata>) {
		serverQueue.node.skip()
	}
}

export default new SkipCommand()
