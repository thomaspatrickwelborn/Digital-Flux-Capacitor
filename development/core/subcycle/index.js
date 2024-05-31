import { EventEmitter } from 'node:events'
class Subcycle extends EventEmitter {
  #_settings = {}
  get settings() { return this.#_settings }
  set settings($settings) { this.#_settings = $settings }
  constructor($settings = {}) {
    super($settings)
    this.settings = $settings
  }
}
export default Subcycle