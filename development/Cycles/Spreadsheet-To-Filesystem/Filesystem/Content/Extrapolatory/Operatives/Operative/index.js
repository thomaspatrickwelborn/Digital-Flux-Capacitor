import { EventEmitter } from 'node:events'
export default class Operative extends EventEmitter {
  #_settings
  constructor($settings) {
    super()
    this.settings = $settings
  }
  get settings() { return this.#_settings }
  set settings($settings) {
    if(this.#_settings === undefined) {
      this.#_settings = $settings
    }
    return this.#_settings
  }
  get root() { return this.settings.root }
}