const { GuildQueueEvent, Util } = require('discord-player');

module.exports = {
	name: GuildQueueEvent.emptyChannel,
	execute: async (queue) => {
        if(!queue.isEmpty()) {
            while(!queue.isPlaying()) {
             await Util.wait(100)
            }
            queue.delete()
         }
         else queue.delete()
	},
};