const { GuildQueueEvent } = require('discord-player');
module.exports = {
	name: GuildQueueEvent.playerError,
	execute: (queue, error, track) => {
        console.log(error)
        console.log(track)
	},
};