const { Util } = require("discord-player")
const { sendEmbed } = require('../utils.js')

module.exports = {
    aliases: ['filter'],
    name: "filter",
    async execute(msg, args, embed, bot) {


        const serverQueue = bot.player.nodes.get(msg.guild.id);

        embed.setDescription(`There are no songs currently playing`);

        if (!serverQueue) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

        while (serverQueue.dispatcher.isBuffering()) {
            await Util.wait(5)
        }
        
        var filter = args[1]

        if (filter == "bassboost_low" || filter == "bassboost_high" || filter == "bassboost")
            filter = "bassboost_low";

        if (filter == "disableall") {
            await serverQueue.filters.ffmpeg.setFilters(false);
            embed.setDescription(`Disabled all filters`);
            return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
        }

        if (!serverQueue.filters.ffmpeg.isValidFilter(args[1])) {
            embed.setDescription(`Invalid filter`);
            return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
        }

        await serverQueue.filters.ffmpeg.toggle([args[1]])

        if (serverQueue.filters.ffmpeg.isEnabled(args[1])) {
            embed.setDescription(`Enabled ${args[1]} filter`);
            return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
        }
        else {
            embed.setDescription(`Disabled ${args[1]} filter`);
            return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
        }

    },
}
