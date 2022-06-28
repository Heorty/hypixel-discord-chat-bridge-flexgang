const DiscordCommand = require('../../contracts/DiscordCommand')


class UptimeCommand extends DiscordCommand {
    constructor(discord) {
        super(discord)

        this.name = 'uptime'
        this.aliases = ['upt']
        this.description = 'See time since last restart'
        this.level = 3
    }

    onCommand(message) {
        const days = Math.floor(process.uptime() / 86400);
        const hours = Math.floor(process.uptime() / 3600) % 24;
        const minutes = Math.floor(process.uptime() / 60) % 60;
        const seconds = Math.floor(process.uptime() % 60);

        message.channel.send({
            embed: {
                color: '000000',
                description: `Time since last restart:\n\n**${days}** day(s)\n**${hours}** hour(s)\n**${minutes}** minute(s)\n**${seconds}** second(s)`,
            }
        })
    }
}

module.exports = UptimeCommand
