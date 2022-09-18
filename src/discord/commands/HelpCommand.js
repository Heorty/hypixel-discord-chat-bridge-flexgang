const DiscordCommand = require('../../contracts/DiscordCommand')

const { version } = require('../../../package.json')

class HelpCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'help'
    this.aliases = ['h', 'info']
    this.description = 'Shows this help menu'
    this.level = 1
  }

  onCommand(message) {
    let discordCommands = []
    let minecraftCommands = []

    this.discord.messageHandler.command.commands.forEach(command => {
      discordCommands.push(`\`${command.name}\`: ${command.description} (level ${command.level})`)
    })

    this.discord.app.minecraft.chatHandler.command.commands.forEach(command => {
      minecraftCommands.push(`\`${command.name}\`: ${command.description}`)
    })

    message.reply({
      embeds: [{
        title: 'Help',
        description: ['`< >` = Required arguments', '`[ ]` = Optional arguments'].join('\n'),
        fields: [
          {
            name: 'Discord Commands',
            value: discordCommands.join('\n')
          },
          {
            name: 'Minecraft Commands',
            value: minecraftCommands.join('\n')
          },
          {
            name: `Info`,
            value: [
              `Prefix: \`${this.discord.app.config.discord.prefix}\``,
              `Guild Channel: <#${this.discord.app.config.discord.channel}>`,
              `Command Role: <@&${this.discord.app.config.discord.commandRole}>`,
              `Version: \`${version}\``,
            ].join('\n'),
          }
        ],
        color: 0x0000,
        footer: {
          text: 'Made by Senither, neyoa and Heorty for FG'
        },
        timestamp: new Date()
      }]
    })
  }
}

module.exports = HelpCommand
