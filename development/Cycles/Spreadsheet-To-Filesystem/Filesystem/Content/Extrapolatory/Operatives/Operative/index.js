import { EventEmitter } from 'node:events'
export default class Operative extends EventEmitter {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get root() { return this.#settings.root }
}