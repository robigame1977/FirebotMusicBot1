const {MessageEmbed} = require("discord.js")
const ytdl = require("ytdl-core")
const ytSearch = require('yt-search')
const message = require("../events/guild/message")
const ffmpeg = require("ffmpeg")
ffmpeg_options = {
    'options': '-vn',
    "before_options": "-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5"
}


const queue = new Map()
console.log("Music function has been injected!")
module.exports = {
    name: "play",
    aliases: ["stop", "skip"],
    description: "Music command :D",
    cooldown: 5,
    async: false,
    async execute(client, message, cmd, args, Discord){
        
        
        const server_queue = queue.get(message.guild.id)
        if (cmd === 'play') { // Play song
            const voice_channel = message.member.voice.channel
        if (!voice_channel) {
            const embed = new MessageEmbed()
            .setColor("#bdbdb3")
            .setTitle(`🎧 Musisz być na kanale głosowym!`)
            .setDescription(` `)
            .setFooter(`Powered by Firebot Music`)
          message.channel.send(embed)
        return
        } 
        const permissions = voice_channel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) {
            const embed = new MessageEmbed()
          .setColor("#e6dc14")
          .setTitle(`🤔 Coś tu źle poszło...`)
          .setDescription(`Nie masz permisji do łączenia się z kanałem\nBy to naprawić, poproś administratora o permisję **CONNECT**!`)
          .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
            return
        }
        if (!permissions.has('SPEAK')) {
            const embed = new MessageEmbed()
          .setColor("#e6dc14")
          .setTitle(`🤔 Coś tu źle poszło...`)
          .setDescription(`Nie masz permisji do mówienia w kanale głosowym...\nBy to naprawić, poproś administratora o permisję **SPEAK**!`)
          .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
            return
        }
        


        
            if (!args.length) {
                const embed = new MessageEmbed()
          .setColor("#e6dc14")
          .setTitle(`🤔 Nie podałeś co mam odtworzyć`)
          .setDescription(` `)
          .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
        return
            }
            let song = {}
            if (ytdl.validateURL(args[0])) {
                const song_info = await ytdl.getInfo(args[0])
                song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url}

            }else{
                const video_finder = async (query) => {
                    const videoResult = await ytSearch(query)
                    return (videoResult.videos.length > 1) ? videoResult.videos[0] : null
                }

                const video = await video_finder(args.join(' '))
                if (video){
                    song = { title: video.title, url: video.url }
                } else {
                    const embed = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`💔 Nie można znaleźć video!`)
          .setDescription(` `)
          .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
                }
            }
        

        if (!server_queue) {
            const queue_constructor = {
                voice_channel: voice_channel,
                text_channel: message.channel,
                connection: null,
                songs: []
            }

            queue.set(message.guild.id, queue_constructor)
            queue_constructor.songs.push(song)

            try {
                const connection = await voice_channel.join()
                queue_constructor.connection = connection
                video_player(message.guild, queue_constructor.songs[0])
            } catch (err) {
                queue.delete(message.guild.id)
                const embed = new MessageEmbed()
                .setColor("#ff0000")
                .setTitle(`💔 Błąd!`)
                .setDescription(`Przepraszamy, wystąpił błąd krytyczny i piosenka **nie** została dodana do listy 😔`)
                .setFooter(`Powered by Firebot Music`)
            message.channel.send(embed)
            throw err
            }
        } else {
            server_queue.songs.push(song)
            const embed = new MessageEmbed()
                .setColor("#46e614")
                .setTitle(`🎼 Dodano piosenkę!`)
                .setDescription(`Dodano **${song.title}** do listy!`)
                .setFooter(`Powered by Firebot Music`)
            message.channel.send(embed)
            return
        }
        }
        else if (cmd === 'stop') stop_song(message, server_queue)// Stop song!
        else if (cmd === 'skip') skip_song(message, server_queue) // Skips song
    }
}

const video_player = async (guild, song, msg, channel, client) => {
    const guildOnly = true
    const args = false
    const song_queue = queue.get(guild.id)

    if (!song) {
        song_queue.voice_channel.leave()
        queue.delete(guild.id)
        return
    }
    const stream = ytdl(song.url, {filter: 'audioonly'})
    song_queue.connection.play(stream, {seek: 0, volume: 0.5})
    .on('finish', () => {
        song_queue.songs.shift()
        video_player(guild, song_queue.songs[0])
    })
    const embed = new MessageEmbed()
    .setColor("#46e614")
    .setTitle(`🎶 Teraz grane **${song.title}**!`)
    .setDescription(` `)
    .setFooter(`Powered by Firebot Music`)
    await song_queue.text_channel.send(embed)
}

const skip_song = (message, server_queue) => {
    if (!message.member.voice.channel) {
        const embed = new MessageEmbed()
          .setColor("#bdbdb6")
          .setTitle(`🎧 Musisz być na kanale głosowym!`)
          .setDescription(` `)
          .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
    }
    if (!server_queue){
        const embed = new MessageEmbed()
          .setColor("#4287f5")
          .setTitle(`Nie ma żadnej piosenki w liście 😔`)
          .setDescription(` `)
          .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
        return
    }
    server_queue.connection.dispatcher.end()
}


const stop_song = (message, server_queue) => {
    if (!message.member.voice.channel) {
        const embed = new MessageEmbed()
        .setColor("#bdbdb6")
        .setTitle(`🎧 Musisz być na kanale głosowym!`)
        .setDescription(` `)
        .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
        return
    }
    server_queue.songs = []
    server_queue.connection.dispatcher.end()
    if (server_queue.songs = []) {
        const embed = new MessageEmbed()
        .setColor("#bdbdb6")
        .setTitle(`🤷‍♂️ Wyczyszczono listę!`)
        .setDescription(` `)
        .setFooter(`Powered by Firebot Music`)
        message.channel.send(embed)
    }
}
