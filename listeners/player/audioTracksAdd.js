const { GuildQueueEvent, Util } = require('discord-player');
const { updatePlayer, queuePlaylistEmbed, sendEmbed } = require('../../utils.js')

module.exports = {
	name: GuildQueueEvent.audioTracksAdd,
	execute: async (queue, tracks) => {
     
        let embed = queuePlaylistEmbed(tracks[0].playlist, queue);

        await updatePlayer(queue)

        await sendEmbed(queue.metadata[1], {embeds: [embed]}, 60000)
 
	},
};