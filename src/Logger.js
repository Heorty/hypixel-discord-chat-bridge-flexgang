const chalk = require('chalk')

class Logger {
  discord(message) {
    return console.log(chalk.bgMagenta.black(`[${this.getCurrentTime()}] Discord >`) + ' ' + chalk.magenta(message))
  }

  minecraft(message) {
    return console.log(chalk.bgGreenBright.black(`[${this.getCurrentTime()}] Minecraft >`) + ' ' + chalk.greenBright(message))
  }

  express(message) {
    return console.log(chalk.bgCyan.black(`[${this.getCurrentTime()}] Express >`) + ' ' + chalk.cyan(message))
  }

  api(message) {
    return console.log(chalk.bgYellow.black(`[${this.getCurrentTime()}] API >`) + ' ' + chalk.yellow(message))
  }

  commands(message) {
    // return cyan
    return console.log(chalk.bgCyan.black(`[${this.getCurrentTime()}] Commands >`) + ' ' + chalk.cyan(message))

  }

  warn(message) {
    return console.log(chalk.bgYellow.black(`[${this.getCurrentTime()}] Warning >`) + ' ' + chalk.yellow(message))
  }

  error(message) {
    return console.log(chalk.bgRedBright.black(`[${this.getCurrentTime()}] Error >`) + ' ' + chalk.redBright(message))
  }

  broadcast(message, location) {
    return console.log(chalk.inverse(`[${this.getCurrentTime()}] ${location} Broadcast >`) + ' ' + message)
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  }
}

module.exports = Logger
