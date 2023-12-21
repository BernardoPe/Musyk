const { GuildQueueEvent } = require('discord-player');
const { EmbedBuilder } = require('discord.js')
const { sendEmbed } = require('../../utils.js')

module.exports = {
	name: GuildQueueEvent.emptyQueue,
	execute: async (queue) => {

        const [vc, channel, data, col] = queue.metadata;
        
        if (col) {
            col.stop()
            queue.metadata[3] = undefined 
        }

        if (data) {
            data.delete()
            queue.metadata[2] = undefined
        }

        let embed = new EmbedBuilder();
        embed.setDescription('Queue is empty, leaving in 5 minutes...')
        embed.setColor(0xED4245);

        await sendEmbed(channel, {embeds: [embed]}, 60000)

	},
};