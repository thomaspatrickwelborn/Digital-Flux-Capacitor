import { EventEmitter } from 'node:events'
import Add from './addAindex.js'
import Update from './Update/index.js'
import Delete from './Delete/index.js'

export default class extends EventEmitter {
  #settings
  constructor($settings) {
    super()
    this.#settings = settings
  }
  #_add
  get add() {
    if(this.#_add === undefined) {
      this.#_add = new Add(this.#settings)
    }
    return this.#_add
  }
  #_update
  get update() {
    if(this.#_update === undefined) {
      this.#_update = new Update(this.#settings)
    }
    return this.#_update
  }
  #_delete
  get delete() {
    if(this.#_delete === undefined) {
      this.#_delete = new Delete(this.#settings)
    }
    return this.#_delete
  }
}