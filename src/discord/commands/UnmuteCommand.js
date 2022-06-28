const DiscordCommand = require('../../contracts/DiscordCommand')

class UnmuteCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'unmute'
    this.aliases = ['um']
    this.description = 'umutes the given user'
    this.level = 3
  }

  onCommand(message) {
    let args = this.getArgs(message)
    let user = args.shift()

    this.sendMinecraftMessage(`/g unmute ${user ? user : ''}`)
  }
}

module.exports = UnmuteCommand
