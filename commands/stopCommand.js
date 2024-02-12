const { sendEmbed } = require('../utils.js')

module.exports = {
    aliases: ['stop'],
    name: 'stop',
    execute: async (msg, args, embed, bot) => {
        const serverQueue = bot.player.nodes.get(msg.guild.id)

        embed.setDescription(`There are no songs currently playing`)
        if (!serverQueue || !serverQueue.isPlaying()) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

        serverQueue.node.stop();
    }
};
