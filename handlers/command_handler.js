const { readdirSync} = require('fs')


module.exports = (client, Discord) => {
    const command_files = readdirSync('./commands/').filter(file => file.endsWith('.command.js'))

    for(const file of command_files){
        const command = require(`../commands/${file}`)
        if (command.name){
            client.commands.set(command.name, command)
        }
        if (command.cooldown){
            client.commands.set(command.cooldown, command)
        }
    }
}