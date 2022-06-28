const Configuration = require('./Configuration')
const DiscordManager = require('./discord/DiscordManager')
const MinecraftManager = require('./minecraft/MinecraftManager')
const ExpressManager = require('./express/ExpressManager')
const ApiManager = require('./hypixel-api/ApiManager')
const SenitherApiManager = require('./senither-api/SenitherApiManager.js')

const Logger = require('./Logger')

class Application {
  async register() {
    this.config = new Configuration()
    this.log = new Logger()

    this.discord = new DiscordManager(this)
    this.minecraft = new MinecraftManager(this)
    this.express = new ExpressManager(this)
    this.api = new ApiManager(this)
    this.senither = new SenitherApiManager(this)


    this.discord.setBridge(this.minecraft)
    this.minecraft.setBridge(this.discord)
  }

  async connect() {
    this.discord.connect()
    this.minecraft.connect()
    this.express.initialize()
    this.api.initialize()
    this.senither.initialize()
  }
}

module.exports = new Application()
