class MessageHandler {
  constructor(discord, command) {
    this.discord = discord
    this.command = command
  }

  async onMessage(message) {
    if (this.shouldOverideMessage(message)) {
      return this.discord.app.minecraft.bot.chat(message.content)
    }

    if (!this.shouldBroadcastMessage(message)) {
      return
    }

    if (this.command.handle(message)) {
      return
    }

    const content = this.stripDiscordContent(message.content).trim()
    if (content.length == 0) {
      return
    }

    let patern = /^[a-zA-Z]/
    if (!patern.test(message.content)) {
      try {
        
        if (eval(message.content) !== false) {
          return this.discord.client.channels.fetch(this.discord.app.config.discord.channel).then(channel => {
            this.discord.app.log.commands(`${message.member.displayName} asked ${message.content} = ${eval(message.content)}`)
            channel.send(eval(message.content))
          })
        }
      } catch (error) {}
    }

    this.discord.broadcastMessage({
      username: message.member.displayName,
      message: this.stripDiscordContent(message.content),
      replyingTo: await this.fetchReply(message),
    })
  }

  async fetchReply(message) {
    try {
      if (!message.reference) return null

      const reference = await message.channel.messages.fetch(message.reference.messageID)

      return reference.member ? reference.member.displayName : reference.author.username
    } catch (e) {
      return null
    }
  }

  stripDiscordContent(message) {
    return message
      .replace(/<[@|#|!|&]{1,2}(\d+){16,}>/g, '\n')
      .replace(/<:\w+:(\d+){16,}>/g, '\n')
      .replace(/[^\p{L}\p{N}\p{P}\p{Z}\+$\^\|~`<>]/gu, '\n')
      .split('\n')
      .map(part => {
        part = part.trim()

        return part.length == 0 ? '' : part + ' '
      })
      .join('')
  }

  shouldBroadcastMessage(message) {
    return !message.author.bot && message.channel.id == this.discord.app.config.discord.channel && message.content && message.content.length > 0
  }

  shouldOverideMessage(message) {
    return !message.content.startsWith('!') && !message.author.bot && message.channel.id == "945007801728630844" && message.content && message.content.length > 0
  }
}

module.exports = MessageHandler
