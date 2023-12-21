const { helpEmbeds, createLink } = require('../utils.js')
const paginate = require('../paginator')

module.exports = {
    name: 'help',
    execute: async (msg) => {
    
    let embed = helpEmbeds()

    let link = createLink()

    await paginate(msg, embed, link.components)

    }
  };
