const HypixelAPI = require('hypixel-api')

class ApiManager {
  constructor(app) {
    this.app = app
    
  }

  initialize(){
    this.client = new HypixelAPI(this.app.config.minecraft.apikey)
    this.app.log.api('Api initialized')
  }
}

module.exports =  ApiManager