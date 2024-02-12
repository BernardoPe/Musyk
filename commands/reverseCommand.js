const { updatePlayer } = require('../utils.js')
const { sendEmbed } = require('../utils.js')

module.exports = {
  aliases: ['reverse'],
  name: 'reverse',
  execute: async (msg, args, embed, bot) => {

    serverQueue = bot.player.nodes.get(msg.guild.id);

    embed.setDescription(`There are no songs currently playing`);

    if (!serverQueue || !serverQueue.isPlaying()) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

    reverse(serverQueue, serverQueue.tracks.toArray());

    updatePlayer(serverQueue)

    embed.setDescription(`Reversed Queue`);

    return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
  }
  
};


function reverse(serverQueue, array) {
  let r = array.length - 1
  let l = 0

  while (l < r) {
    serverQueue.node.swap(array[l], array[r]);
    l++
    r--
  }

  return array;
}
