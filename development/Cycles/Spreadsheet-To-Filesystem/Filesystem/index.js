import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir, stat } from 'node:fs'
import Root from './Root/index.js'
import Content from './Content/index.js'

export default class Filesystem extends EventEmitter {
  #settings
  #_root
  #_content
   constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#root
    this.content
  }
  get #databases() { return this.#settings.databases }
  get #root() {
    if(this.#_root === undefined) {
      this.#_root = new Root(
        this.#settings.filesystem
      )
    }
    return this.#_root
  }
  get content() {
    if(this.#_content === undefined) {
      this.#_content = new Content({
        root: this.#root,
        content: this.#settings.filesystem.content,
        deleteExtraneous: this.#settings.filesystem.deleteExtraneous,
        databases: this.#databases,
      })
    }
    return this.#_content
  }
  
}
