const DiscordCommand = require('../../contracts/DiscordCommand')
const axios = require('axios').default;

class WeightCommand extends DiscordCommand {
  constructor(discord) {
    super(discord)

    this.name = 'weight'
    
    this.aliases = ["we","weights","poid", "poids"]
    this.description = 'Give the weight of the player'
    this.level = 1
  }

  onCommand(message) {

    let dc = this
    let args = this.getArgs(message)
    let user
    let data
    
    if (args.length != 0) {
        user = args[0]
    } else {
        return message.reply("you need to specify a user")
    }

    let key = this.discord.app.config.minecraft.apikey
        axios.get("https://api.mojang.com/users/profiles/minecraft/" + user)
            .then(function (response) {
                axios.get("https://hypixel-api.senither.com/v1/profiles/"+response.data.id+"/weight", {
                    params: {
                      key: key
                    }
                  }).then(function (response){
                    data = response.data.data
                    return dc.discord.app.minecraft.broadcastSenitherWebhook(`**${data.username} weight :** ${numberWithCommas(Math.round(data.weight + data.weight_overflow))} (${numberWithCommas(Math.round(data.weight_overflow))} overflow)`)



                  }).catch(function (error) {
                    console.log(error);
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    

    
  }
}

module.exports = WeightCommand

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}
