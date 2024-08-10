import EventEmitter from 'node:events'
export default class Timer extends EventEmitter {
  #settings
  #delay = 1
  #_elapse = 0
  #_interval
  #_name
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get name() { return this.#settings.name }
  get #interval() { return this.#_interval }
  set #interval($interval) { this.#_interval = $interval }
  get elapse() { return this.#_elapse }
  set elapse($elapse) {
    this.#_elapse = $elapse
    this.emit('elapse', this.#_elapse)
  }
  durate() { this.elapse += this.#delay }
  start() {
    this.elapse = 0
    this.#interval = setInterval(
      this.durate.bind(this), this.#delay
    )
    return this
  }
  stop() {
    clearInterval(this.#interval)
    return this
  }
  log() {
    console.log([
      '-----',
      this.name,
      `${this.elapse} milliseconds`,
      `${this.elapse / 1000} seconds`,
      '-----',
    ].join('\n'))
    return this
  }
}