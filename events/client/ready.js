<<<<<<< HEAD
const chalk = require('chalk')
const { Client } = require('discord.js')
const client = new Client();
module.exports = () =>{
    console.clear()
    //console.log(chalk.bgGreen.bold(`Zalogowano jako ${client.user.tag}!`));
    //console.log(chalk.bgGray.bold(`Na Serwerach: ${client.guilds.cache.size}`))
    console.log(chalk.bgGreen.bold(`Zalogowano jako Firebot!`));
    console.log(chalk.bgGray.bold(`Na Serwerach: ${client.guilds.cache.size}`))
=======
const chalk = require('chalk')
const { Client } = require('discord.js')
const client = new Client();
module.exports = () =>{
    console.clear()
    //console.log(chalk.bgGreen.bold(`Zalogowano jako ${client.user.tag}!`));
    //console.log(chalk.bgGray.bold(`Na Serwerach: ${client.guilds.cache.size}`))
    console.log(chalk.bgGreen.bold(`Zalogowano jako Firebot!`));
    console.log(chalk.bgGray.bold(`Na Serwerach: ${client.guilds.cache.size}`))
>>>>>>> 7980b0eb4e3bcb8a5e30853f461a156d0525d7ed
}