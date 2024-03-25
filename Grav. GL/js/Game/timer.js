class Timer {
  constructor () {
    this.restart()
  }

  restart () {
    this.startTime = Date.now()
    this.savedTime = 0
    this.hours = 0
    this.minutes = 0
    this.seconds = 0
  }

  timePassed () {
    const time = Date.now()
    const diff = time - this.startTime

    return diff
  }

  update () {
    const diff = this.timePassed()

    let seconds = diff * 0.001
    let minutes = seconds / 60
    let hours = minutes / 60

    seconds = Math.floor(seconds % 60)
    minutes = Math.floor(minutes % 60)
    hours = Math.floor(hours % 100)

    this.seconds = formatString(seconds, '0', 2)
    this.minutes = formatString(minutes, '0', 2)
    this.hours = formatString(hours, '0', 2)
  }

  stop () {
    this.savedTime = this.timePassed()
  }

  start () {
    this.startTime += this.timePassed() - this.savedTime
  }

  hasHours () {
    return this.hours !== '00'
  }

  get () {
    this.update()

    const { hours, minutes, seconds } = this

    if (this.hasHours()) {
      return `${hours}:${minutes}:${seconds}`
    }

    return `${minutes}:${seconds}`
  }

  static create () {
    return new Timer()
  }
}
