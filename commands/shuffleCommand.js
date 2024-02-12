const { updatePlayer } = require('../utils.js')
const { sendEmbed } = require('../utils.js')

module.exports = {
  aliases: ['shuffle'],
  name: 'shuffle',
  execute: async (msg, args, embed, bot) => {

    serverQueue = bot.player.nodes.get(msg.guild.id);

    embed.setDescription(`There are no songs currently playing`);

    if (!serverQueue || !serverQueue.isPlaying()) return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)
    
    shuffle(serverQueue, serverQueue.tracks.toArray());

    updatePlayer(serverQueue)

    embed.setDescription(`Shuffled Queue`);
    return await sendEmbed(msg.channel, { embeds: [embed] }, 20000)

  }
  
};


function shuffle(serverQueue, array) {

  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {

    randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    currentIndex--;

    serverQueue.node.swap(array[currentIndex], randomIndex);

  }

  return array;
  
}
