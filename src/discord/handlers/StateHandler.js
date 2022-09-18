const res = require("express/lib/response")

class StateHandler {
  constructor(discord) {
    this.discord = discord
    this.updateGuildMembers = null
    this.updateDiscordMembers = null
    this.updateOnline = null
  }

  async onReady() {
    this.discord.app.log.discord('Client ready, logged in as ' + this.discord.client.user.tag)
    this.discord.client.user.setActivity('Guild Chat', { type: 'WATCHING' })

    if (this.discord.app.config.discord.messageMode == 'webhook') {
      this.discord.webhook = await getWebhook(this.discord)
    }

    this.discord.client.channels.fetch(this.discord.app.config.discord.channel).then(channel => {
      channel.send({
        embeds: [{
          author: { name: `Chat Bridge is Online` },
          color: 0x47F049
        }]
      })
    })

    updateDiscordMembersChannel(this.discord)
    updateGMembersChannel(this.discord)

    this.updateGuildMembers = setInterval(updateGMembersChannel, 3600000, this.discord)
    this.updateDiscordMembers = setInterval(updateDiscordMembersChannel, 3600000, this.discord)
    this.updateOnline = setInterval(updateOnlineGMembersCHannel, 300000, this.discord)

  }




  onClose() {
    this.discord.client.channels.fetch(this.discord.app.config.discord.channel).then(channel => {
      channel.send({
        embeds: [{
          author: { name: `Chat Bridge is Offline` },
          color: 0xF04947
        }]
      }).then(() => { process.exit() })
    }).catch(() => { process.exit() })
  }
}

async function getWebhook(discord) {
  let channel = discord.client.channels.cache.get(discord.app.config.discord.channel)
  let webhooks = await channel.fetchWebhooks()
  if (webhooks.first()) {
    return webhooks.first()
  } else {
    var res = await channel.createWebhook(discord.client.user.username, {
      avatar: discord.client.user.avatarURL(),
    })
    return res
  }
}

async function updateGMembersChannel(discord) {
  discord.app.log.discord('Refreshing Guild Member Count')
  return discord.client.channels.fetch(discord.app.config.discord.guildMemberChannel).then(channel => {
    discord.app.api.client.getGuild(discord.app.config.minecraft.guildId).then((guildData) => {
      channel.setName(`Guild Members: ${Object.keys(guildData.guild.members).length}`)

    }).catch((err) => { console.error('Error!' + err) })
  })
}

async function updateDiscordMembersChannel(discord) {
  discord.app.log.discord('Refreshing Discord Member Count')
  return discord.client.channels.fetch(discord.app.config.discord.discordMemberChannel).then(channel => {
    discord.client.guilds.fetch(discord.app.config.discord.guildId).then(guild => {
      channel.setName(`Members: ${guild.memberCount}`)
    })
      

  })
}

async function updateOnlineGMembersCHannel(discord) {
  discord.app.log.discord('Refreshing Online Member Count')
  return discord.app.minecraft.bot.chat('/g online')
}
module.exports = StateHandler
