const MinecraftCommand = require('../../contracts/MinecraftCommand')
const axios = require('axios').default;

class WeightCommand extends MinecraftCommand {
  constructor(minecraft) {
    super(minecraft)

    this.name = 'weight'
    this.aliases = ["we", "weights", "poid", "poids"]
    this.description = 'Give the weight of the player'
  }

  onCommand(username, message) {

    let mc = this
    let args = this.getArgs(message)
    let user
    let data

    if (args.length != 0) {
      user = args[0]
    } else {
      user = username
    }

    let key = this.minecraft.app.config.minecraft.apikey
    axios.get("https://api.mojang.com/users/profiles/minecraft/" + user)
      .then(function (response) {
          if (response.status != 200) {return this.send(`/gc No MC account found for ${ign}`)}
          axios.get("https://hypixel-api.senither.com/v1/profiles/" + response.data.id + "/weight", {
            params: {
              key: key
            }
          }).then(function (response) {

            // console.log(response)
            data = response.data.data
            mc.minecraft.broadcastSenitherWebhook(`**${data.username} weight :** ${numberWithCommas(Math.round(data.weight + data.weight_overflow))} (${numberWithCommas(Math.round(data.weight_overflow))} overflow)`)
            //  .send(`/gc ${data.username} weight : ${numberWithCommas(Math.round(data.weight + data.weight_overflow))} (${numberWithCommas(Math.round(data.weight_overflow))} overflow)`)

             return mc.send(`/gc ${data.username} weight for their ${data.name} profile is ${toFixed(data.weight)} + ${toFixed(data.weight_overflow)} Overflow ${toFixed(data.weight + data.weight_overflow)} Total`)


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
function toFixed(num) {
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (0 || -1) + '})?');
  return numberWithCommas(num.toString().match(re)[0]);
}