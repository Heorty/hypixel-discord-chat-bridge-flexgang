const DiscordCommand = require('../../contracts/DiscordCommand')

class OnlineCommand extends DiscordCommand {

  constructor(discord) {
    super(discord)
    this.name = 'online'
    this.aliases = ['on']
    this.description = 'Manually check onlines players in the guild';
    this.level = 2;
  }

  onCommand(message) {
    this.discord.app.discord.client.channels.fetch(this.discord.app.config.discord.onlineGuildMemberChannel).then(channel => {
      let content = channel.name
      message.channel.send({
        embed: {
          color: '5269E6',
          description: content,
        }
      })
    })
  }
}

module.exports = OnlineCommand
