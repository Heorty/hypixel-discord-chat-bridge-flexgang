const fs = require('fs')
const { Collection, Routes } = require('discord.js')
const { REST } = require('@discordjs/rest');

class CommandHandler {
  constructor(discord) {
    this.discord = discord

    this.prefix = discord.app.config.discord.prefix
    this.commands = new Collection()
    let commandFiles = fs.readdirSync('./src/discord/commands').filter(file => file.endsWith('.js'))
    for (const file of commandFiles) {
      const command = new (require(`./commands/${file}`))(discord)
      this.commands.set(command.name, command)
    }
  }

  handle(message) {
    if (!message.content.startsWith(this.prefix)) {
      return false
    }

    let args = message.content.slice(this.prefix.length).trim().split(/ +/)
    let commandName = args.shift().toLowerCase()

    let command = this.commands.get(commandName)
      || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }


    if ((command.level == 4 && !this.isOwner(message.member)) || (command.level == 3 && !this.isCommander(message.member)) || (command.level == 2 && !this.isMember(message.member))) {
      return message.channel.send({
        embeds: [{
          description: `You don't have permission to do that.`,
          color: 0xDC143C
        }]
      })
    }

    this.discord.app.log.discord(`[${command.name}] ${message.content}`)
    command.onCommand(message)

    return true
  }

  handleInteraction(interaction) {

    let commandName = interaction.commandName

    let command = this.commands.get(commandName)
      || this.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) {
      return false
    }


    if ((command.level == 4 && !this.isOwner(interaction.member)) || (command.level == 3 && !this.isCommander(interaction.member)) || (command.level == 2 && !this.isMember(interaction.member))) {
      return interaction.channel.send({
        embeds: [{
          description: `You don't have permission to do that.`,
          color: 0xDC143C
        }]
      })
    }

    this.discord.app.log.discord(`[${command.name}] ${interaction.content}`)
    command.onCommand(interaction)

    return true
  }

  isMember(member) {
    return member.roles.cache.find(r => r.id == this.discord.app.config.discord.memberRole) || member.roles.cache.find(r => r.id == this.discord.app.config.discord.commandRole) || member.id == this.discord.app.config.discord.ownerId
  }

  isCommander(member) {
    return member.roles.cache.find(r => r.id == this.discord.app.config.discord.commandRole) || member.id == this.discord.app.config.discord.ownerId
  }

  isOwner(member) {
    return member.id == this.discord.app.config.discord.ownerId
  }
}

module.exports = CommandHandler