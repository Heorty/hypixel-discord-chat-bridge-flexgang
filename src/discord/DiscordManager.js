const CommunicationBridge = require('../contracts/CommunicationBridge')
const StateHandler = require('./handlers/StateHandler')
const MessageHandler = require('./handlers/MessageHandler')
const CommandHandler = require('./CommandHandler')


const Discord = require('discord.js-light')

class DiscordManager extends CommunicationBridge {
  constructor(app) {
    super()

    this.app = app

    this.stateHandler = new StateHandler(this)
    this.commandHandler = new CommandHandler(this)
    this.messageHandler = new MessageHandler(this, this.commandHandler)
  }

  connect() {
    this.client = new Discord.Client({
      cacheGuilds: true,
      cacheChannels: true,
      cacheOverwrites: false,
      cacheRoles: true,
      cacheEmojis: false,
      cachePresences: false,
    })

    this.client.on('ready', () => this.stateHandler.onReady())
    this.client.on('message', message => this.messageHandler.onMessage(message))

    // const rest = new REST({ version: '9' }).setToken(this.app.config.discord.token);

    // (async () => {
    //   try {
    //     console.log('Started refreshing application (/) commands.');
    
    //     await rest.put(
    //       Routes.applicationGuildCommands(this.client.id, this.app.config.discord.guildId),
    //       { body: this.commandHandler.commands.values() },
    //     );
    
    //     console.log('Successfully reloaded application (/) commands.');
    //   } catch (error) {
    //     console.error(error);
    //   }
    // })();


    this.client.login(this.app.config.discord.token).catch(error => {
      this.app.log.error(error)

      process.exit(1)
    })

    process.on('SIGINT', () => this.stateHandler.onClose())
  }

  onBroadcast({
    username,
    message,
    guildRank
  }) {
    this.app.log.broadcast(`${username} [${guildRank}]: ${message}`, `Discord`)
    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.app.discord.client.channels.fetch(this.app.config.discord.channel).then(channel => {
          channel.send({
            embed: {
              description: message,
              color: '6495ED',
              timestamp: new Date(),
              footer: {
                text: guildRank,
              },
              author: {
                name: username,
                icon_url: 'https://www.mc-heads.net/avatar/' + username,
              },
            },
          })
        })
        break

      case 'webhook':
        message = message.replace(/@/g, '') // Stop pinging @everyone or @here
        this.app.discord.webhook.send(
          message, {
          username: `${username} [${guildRank} 🎮]`,
          avatarURL: 'https://www.mc-heads.net/avatar/' + username
        }
        )
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }

  onBroadcastSimpleMessage(message) {
    this.app.discord.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      channel.send(message)
    })
  }

  onBroadcastSCWebhook(message) {
    console.log(message)
    this.app.discord.webhook.send(
      message, {
      username: `SkyCrypt`,
      avatarURL: 'https://d1udgqfupqwo5g.cloudfront.net/images/uploaded.15c60893d96574c0f2c8d378d1c1ef17.png'
    }
    )
  }

  onBroadcastSenitherWebhook(message) {
    this.app.discord.webhook.send(
      message, {
      username: `Senither`,
      avatarURL: 'https://avatars.githubusercontent.com/u/8415349?s=128&v=4'
    }
    )
  }

  onBroadcastCleanEmbed({
    message,
    color
  }) {
    this.app.log.broadcast(message, 'Event')

    this.app.discord.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      channel.send({
        embed: {
          color: color,
          description: message,
        }
      })
    })
  }

  onBroadcastHeadedEmbed({
    message,
    title,
    icon,
    color
  }) {
    this.app.log.broadcast(message, 'Event')

    this.app.discord.client.channels.fetch(this.app.config.discord.channel).then(channel => {
      channel.send({
        embed: {
          color: color,
          author: {
            name: title,
            icon_url: icon,
          },
          description: message,
        }
      })
    })
  }

  onPlayerToggle({
    username,
    message,
    color
  }, type) {
    this.app.log.broadcast(username + ' ' + message, 'Event')

    switch (this.app.config.discord.messageMode.toLowerCase()) {
      case 'bot':
        this.app.discord.client.channels.fetch(this.app.config.discord.channel).then(channel => {
          channel.send({
            embed: {
              color: color,
              timestamp: new Date(),
              author: {
                name: `${username} ${message}`,
                icon_url: 'https://www.mc-heads.net/avatar/' + username,
              },
            }
          })
        })
        break

      case 'webhook':

        this.app.discord.client.channels.fetch(this.app.config.discord.channel).then(channel => {
          switch (type) {
            case "join":
              channel.send(`>>> <:join:943866143259648060> **${username}** joined.`)
              break;
            case "leave":
              channel.send(`>>> <:left:943866472306995210> **${username}** left.`)
              break;

            default:
              break;
          }
        })
        break

      default:
        throw new Error('Invalid message mode: must be bot or webhook')
    }
  }
}

module.exports = DiscordManager
