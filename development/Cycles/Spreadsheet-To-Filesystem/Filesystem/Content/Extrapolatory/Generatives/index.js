import { EventEmitter } from 'node:events'
import File from './File/index.js'
export default class Generatives extends EventEmitter {
  #settings
  #_file
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get file() {
    if(this.#_file === undefined) {
      this.#_file = new File(this.#settings)
    }
    return this.#_file
  }
}
