const axios = require('axios').default;

class SenitherApiManager {
    constructor(app) {
        this.app = app
        this.key = this.app.config.minecraft.apikey
    }

    initialize() {
        axios.get("https://hypixel-api.senither.com/v1/hello", {
            params: {
              key: this.key
            }
          }).then(resp => {
            this.app.log.api('Senither Api initialized')
          }).catch(err => {
            console.log(err)
          })
        
    }

    getWeight(user) {
        let key = this.key
        axios.get("https://api.mojang.com/users/profiles/minecraft/" + user)
            .then(function (response) {
                axios.get("https://hypixel-api.senither.com/v1/profiles/"+response.data.id+"/weight", {
                    params: {
                      key: key
                    }
                  }).then(function (response){
                    return response.data.data

                  }).catch(function (error) {
                    console.log(error);
                })
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

module.exports = SenitherApiManager