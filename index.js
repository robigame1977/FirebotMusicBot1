const prefix = "^"
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const { token } = require('./config.js')
const bot_version = '0.3.4.1'

// Command handler stuff
client.commands = new Discord.Collection()
client.events = new Discord.Collection()


let handler = ['command_handler', 'event_handler'].forEach(handler =>{
  require(`./handlers/${handler}`)(client, Discord)
})


client.login(token);