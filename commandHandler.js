const playCommand = require('./commands/playCommand');
const stopCommand = require('./commands/stopCommand');
const skipCommand = require('./commands/skipCommand');
const pauseCommand = require('./commands/pauseCommand');
const resumeCommand = require('./commands/resumeCommand');
const queueCommand = require('./commands/queueCommand');
const volumeCommand = require('./commands/volumeCommand');
const removeCommand = require('./commands/removeCommand');
const shuffleCommand = require('./commands/shuffleCommand');
const skiptoCommand = require('./commands/skiptoCommand');
const jumpCommand = require('./commands/jumpCommand');
const cycleCommand = require('./commands/cycleCommand');
const helpCommand = require('./commands/helpCommand');
const reverseCommand = require('./commands/reverseCommand');
//const filterCommand = require('./commands/filter');
const seekCommand = require('./commands/seekCommand');

const { getServerPrefixFromJson } = require('./utils');

const commands = {
    seek: seekCommand,
    p : playCommand,
    play : playCommand,
    stop : stopCommand,
    s : skipCommand,
    skip : skipCommand,
    pause : pauseCommand,
    resume : resumeCommand,
    queue : queueCommand,
    volume : volumeCommand,
    remove : removeCommand,
    shuffle : shuffleCommand,
    skipto : skiptoCommand,
    jump : jumpCommand, 
    cycle : cycleCommand,
    help : helpCommand,
    reverse: reverseCommand,
   // filter: filterCommand,
};


module.exports = async (msg, args, embed, bot) => {
    
    const PREFIX = getServerPrefixFromJson(msg.guild.id)
    const commandName = args[0].slice(PREFIX.length).toLowerCase(); 
  
    if (commands.hasOwnProperty(commandName)) {

      const command = commands[commandName];

      let date = new Date
      
      command.msg = msg.content
      command.time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

      console.log(command)

      await command.execute(msg, args, embed, bot);
   
      
    }
    
    else {
        return undefined; 
    }
    
};
