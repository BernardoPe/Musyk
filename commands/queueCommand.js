const { createQueueEmbed } = require('../utils.js')
const paginate  = require('../paginator');
const { Util } = require("discord-player")
const { sendEmbed } = require('../utils.js')

module.exports = {
    name: 'queue',
    execute: async (msg, args, embed, bot) => {

        let serverQueue = bot.player.nodes.get(msg.guild.id)

        embed.setColor(0xfd0033).setDescription(`There are no songs in queue`)

        if (!serverQueue || serverQueue.isEmpty() || !serverQueue.isPlaying()) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

        let pages = createQueueEmbed(serverQueue)
    
        return await paginate(msg, pages)

    }
  };
