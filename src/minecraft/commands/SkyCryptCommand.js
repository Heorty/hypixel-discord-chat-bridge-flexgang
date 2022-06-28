const MinecraftCommand = require('../../contracts/MinecraftCommand')

class SkyCryptCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'skycrypt'
    this.aliases = ['sc', 'sb' , 'pv']
    this.description = 'Send skycrypt link for a specified user'
  }

  onCommand(username, message) {
    let args = this.getArgs(message)
    let user = args[0]
    let resp
    
    if (args.length != 0) {
        resp = 'https://sky.shiiyu.moe/stats/' + user
    } else {
        resp = 'https://sky.shiiyu.moe/stats/' + username
        user = username
    }
    this.minecraft.broadcastSCWebhook(resp)
    return this.send(`/gc ${resp}`)
  }
}

module.exports = SkyCryptCommand
