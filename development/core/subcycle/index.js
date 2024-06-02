import { EventEmitter } from 'node:events'
class Subcycle extends EventEmitter {
  #_settings = {}
  constructor($settings = {}, $options = {}) {
    super()
    this.settings = $settings
  }
  get settings() { return this.#_settings }
  set settings($settings) { this.#_settings = $settings }
}
export default Subcycle