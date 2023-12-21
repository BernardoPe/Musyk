
const { Player } = require('discord-player');
const { YouTubeExtractor, SpotifyExtractor, SoundCloudExtractor } = require("@discord-player/extractor");
const { Client, GatewayIntentBits} = require('discord.js');
const { addEventListeners } = require('./handlers/eventHandler.js')
const config = require('./config.json')

const access = fs.createWriteStream(`${__dirname}/LOG.log`)
process.stdout.write = process.stderr.write = access.write.bind(access)

const TOKEN = config.TOKEN

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ],
});
  
bot.player = new Player(bot, {
  ytdlOptions: {
    quality: 'highestaudio',
    filter: 'audioonly',
    requestOptions: {
      headers: {
        cookie: 'YOUTUBE-COOKIE-HEADER-HERE'
      }
    }
  },
  leaveOnEnd: true,
  leaveOnStop: true,
  leaveOnEmpty: true,
  leaveOnEmptyCooldown: 60000,
  autoSelfDeaf: true,
  initialVolume: 20,
  bufferingTimeout: 20000
});

//console.log(bot.player.scanDeps())

bot.player.extractors.register(YouTubeExtractor);
bot.player.extractors.register(SpotifyExtractor);
bot.player.extractors.register(SoundCloudExtractor);

addEventListeners(bot)

bot.login(TOKEN);
