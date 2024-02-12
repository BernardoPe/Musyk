const { GuildQueueEvent, Util } = require('discord-player');
const { updatePlayer, songQueuedEmbed, sendEmbed } = require('../../utils.js')

module.exports = {
	name: GuildQueueEvent.audioTrackAdd,
	execute: async (queue, track) => {
        
        if (!queue.isPlaying()) return
  
        let embed = songQueuedEmbed(track, queue);

        await updatePlayer(queue)

        await sendEmbed(queue.metadata[1], {embeds: [embed]}, 60000)},
    
};