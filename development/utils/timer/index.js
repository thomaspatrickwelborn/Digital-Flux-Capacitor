import EventEmitter from 'node:events'
export default class Timer extends EventEmitter {
  #_name
  get name() { return this.#_name }
  set name($name) {
    if(this.#_name === undefined) {
      this.#_name = $name || 'undefined'
    }
  }
  #_interval
  get #interval() { return this.#_interval }
  set #interval($interval) {
    this.#_interval = $interval
  }
  #delay = 1
  #_elapse = 0
  get elapse() { return this.#_elapse }
  set elapse($elapse) {
    this.#_elapse = $elapse
    this.emit('elapse', this.#_elapse)
  }
  durate() {
    this.elapse += this.#delay
  }
  constructor($settings) {
    super()
    const { name } = $settings
    this.name = name
  }
  start() {
    this.elapse = 0
    this.#interval = setInterval(this.durate.bind(this), this.#delay)
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
  }
}