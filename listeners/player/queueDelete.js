const { GuildQueueEvent, Util } = require('discord-player');
const { EmbedBuilder } = require('discord.js')
const { sendEmbed } = require('../../utils.js')
module.exports = {
	name: GuildQueueEvent.queueDelete,
	execute: async (queue) => {
        await Util.wait(200) 

        const [vc, channel, data, col] = queue.metadata;

        let embed = new EmbedBuilder();

        if(vc.members.size == 0) embed.setDescription('Voice channel is empty, leaving...')
        else embed.setDescription('Leaving the channel...')

        if(col) col.stop()
        if(data) data.delete()

        embed.setColor(0xED4245);

        await sendEmbed(channel, {embeds: [embed]}, 20000)
    
	},
};