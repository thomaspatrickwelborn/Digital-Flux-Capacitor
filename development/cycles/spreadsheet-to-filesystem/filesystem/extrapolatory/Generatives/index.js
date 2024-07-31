import { EventEmitter } from 'node:events'
import Content from './Content/index.js'
export default class Generatives extends EventEmitter {
  #settings
  #_content
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get content() {
    if(this.#_content === undefined) {
      this.#_content = new Content()
    }
    return this.#_content
  }
}