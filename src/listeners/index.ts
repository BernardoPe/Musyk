import type { ClientEventHandler, GuildQueueEventHandler } from "@/types.ts"

import clientDisconnect from "@/listeners/client/disconnect.ts"
import clientError from "@/listeners/client/error.ts"
import interactionCreate from "@/listeners/client/interactionCreate.ts"
import messageCreate from "@/listeners/client/messageCreate.ts"
import ready from "@/listeners/client/ready.ts"
import reconnecting from "@/listeners/client/reconnecting.ts"
import warn from "@/listeners/client/warn.ts"

import audioTrackAdd from "@/listeners/player/audioTrackAdd.ts"
import audioTracksAdd from "@/listeners/player/audioTracksAdd.ts"
import debug from "@/listeners/player/debug.ts"
import emptyChannel from "@/listeners/player/emptyChannel.ts"
import emptyQueue from "@/listeners/player/emptyQueue.ts"
import playerError from "@/listeners/player/playerError.ts"
import playerPause from "@/listeners/player/playerPause.ts"
import playerResume from "@/listeners/player/playerResume.ts"
import playerStart from "@/listeners/player/playerStart.ts"
import queueDelete from "@/listeners/player/queueDelete.ts"
import volumeChange from "@/listeners/player/volumeChange.ts"
import playerErrorLegacy from "@/listeners/player/error.ts"

const clientListeners: ClientEventHandler[] = [
	clientDisconnect,
	clientError,
	interactionCreate,
	messageCreate,
	ready,
	reconnecting,
	warn,
]

const playerListeners: GuildQueueEventHandler[] = [
	audioTrackAdd,
	audioTracksAdd,
	debug,
	emptyChannel,
	emptyQueue,
	playerError,
	playerErrorLegacy,
	playerPause,
	playerResume,
	playerStart,
	queueDelete,
	volumeChange,
]

export { clientListeners, playerListeners }
