const fs = require('fs')

class Configuration {
  properties = {
    server: {
      host: 'localhost',
      port: 25565,
    },
    minecraft: {
      username: null,
      password: null,
      lobbyHolder: null,
      accountType: 'mojang',
      apikey: null,
      guildId:''
    },
    discord: {
      token: null,
      channel: null,
      memberRole: '',
      commandRole: '',
      ownerId: '',
      prefix: '!',
      messageMode: 'bot',
      guildId:"",
      guildMemberChannel: "",
      onlineGuildMemberChannel: "",
      discordMemberChannel: ""
    },
    express: {
      enabled: false,
      port: 8880,
      authorization: "authorizationHeaderString"
    }
  }

  environmentOverrides = {
    SERVER_HOST: val => (this.properties.server.host = val),
    SERVER_PORT: val => (this.properties.server.port = val),
    MINECRAFT_USERNAME: val => (this.properties.minecraft.username = val),
    MINECRAFT_PASSWORD: val => (this.properties.minecraft.password = val),
    MINECRAFT_LOBBY_HOLDER: val => (this.properties.minecraft.lobbyHolder = val),
    MINECRAFT_ACCOUNT_TYPE: val => (this.properties.minecraft.accountType = val),
    HYPIXEL_APIKEY: val => (this.properties.minecraft.apikey = val),
    HYPIXEL_GUILD_ID: val => (this.properties.minecraft.guildname = val),
    DISCORD_TOKEN: val => (this.properties.discord.token = val),
    DISCORD_GUILD_ID:val => (this.properties.discord.guildId = val),
    DISCORD_CHANNEL: val => (this.properties.discord.channel = val),
    DISCORD_GUILD_MEMBER_CHANNEL: val => (this.properties.discord.guildMemberChannel = val),
    DISCORD_DISCORD_MEMBER_CHANNEL: val => (this.properties.discord.discordMemberChannel = val),
    DISCORD_GUILD_ONLINE_MEMBER_CHANNEL: val => (this.properties.discord.onlineGuildMemberChannel = val),
    DISCORD_COMMAND_ROLE: val => (this.properties.discord.commandRole = val),
    DISCORD_MEMBER_ROLE: val => (this.properties.discord.memberRole = val),
    DISCORD_OWNER_ID: val => (this.properties.discord.ownerId = val),
    DISCORD_PREFIX: val => (this.properties.discord.prefix = val),
    MESSAGE_MODE: val => (this.properties.discord.messageMode = val),
    EXPRESS_ENABLED: val => (this.properties.express.enabled = val),
    EXPRESS_PORT: val => (this.properties.express.enabled = val),
    EXPRESS_AUTHORIZATION: val => (this.properties.express.authorization = val)
  }

  constructor() {
    if (fs.existsSync('config.json')) {
      this.properties = require('../config.json')
    }

    for (let environment of Object.keys(process.env)) {
      if (this.environmentOverrides.hasOwnProperty(environment)) {
        this.environmentOverrides[environment](process.env[environment])
      }
    }
  }

  get server() {
    return this.properties.server
  }

  get minecraft() {
    return this.properties.minecraft
  }

  get discord() {
    return this.properties.discord
  }

  get express() {
    return this.properties.express
  }
}

module.exports = Configuration
