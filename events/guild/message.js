const { Collection } = require("discord.js")
const cooldowns = new Map()

module.exports = (Discord, client, message) => {
    
    const prefix = '^'
    if(!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const cmdName = args.shift().toLowerCase()
    const cmd = client.commands.get(cmdName) || client.commands.find(a => a.aliases && a.aliases.includes(cmdName))


    if (!cmdName) return



    try{
        if (!cmdName) return
        client.commands.get(cmdName).execute(client, message, cmdName, args, Discord)
        console.log(`Executed ${cmdName}!`)
    } catch (err){
        message.reply("💔 | Wystąpił błąd krytyczny!")
        message.author.send("Please send this report to main developer of firebot!")
        message.author.send(`\`\`\`Command: ${cmdName}\nArgs: ${args}\nMessage: ${message}\nAuthor: ${message.author.tag}\nErr code: ${err}\`\`\``)
        console.log(err)
    }
}