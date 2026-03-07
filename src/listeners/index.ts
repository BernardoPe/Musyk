import type { ClientEventHandler, GuildQueueEventHandler } from "../types.ts"

import clientDisconnect from "./client/disconnect.ts"
import clientError from "./client/error.ts"
import interactionCreate from "./client/interactionCreate.ts"
import messageCreate from "./client/messageCreate.ts"
import ready from "./client/ready.ts"
import reconnecting from "./client/reconnecting.ts"
import warn from "./client/warn.ts"

import audioTrackAdd from "./player/audioTrackAdd.ts"
import audioTracksAdd from "./player/audioTracksAdd.ts"
import debug from "./player/debug.ts"
import emptyChannel from "./player/emptyChannel.ts"
import emptyQueue from "./player/emptyQueue.ts"
import playerError from "./player/playerError.ts"
import playerPause from "./player/playerPause.ts"
import playerResume from "./player/playerResume.ts"
import playerStart from "./player/playerStart.ts"
import queueDelete from "./player/queueDelete.ts"
import volumeChange from "./player/volumeChange.ts"
import playerErrorLegacy from "./player/error.ts"

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
