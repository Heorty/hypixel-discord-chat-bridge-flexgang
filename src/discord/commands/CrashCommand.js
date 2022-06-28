const DiscordCommand = require('../../contracts/DiscordCommand')


class CrashCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)

        this.name = 'crash'
        this.aliases = ['c']
        this.description = 'Crash the bot'
        this.level = 4
    }

    onCommand(message) {
        process.abort()
    }
}

module.exports = CrashCommand
