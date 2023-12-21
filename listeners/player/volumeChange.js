const { GuildQueueEvent } = require('discord-player');
const { updatePlayer } = require('../../utils.js')
module.exports = {
	name: GuildQueueEvent.volumeChange,
	execute: async (queue) => {
        updatePlayer(queue)
	},
};