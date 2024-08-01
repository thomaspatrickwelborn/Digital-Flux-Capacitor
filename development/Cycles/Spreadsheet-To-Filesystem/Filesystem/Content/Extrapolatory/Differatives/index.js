import { EventEmitter } from 'node:events'
import Add from './Add/index.js'
import Update from './Update/index.js'
import Delete from './Delete/index.js'

export default class Differatives extends EventEmitter {
  #settings
  #_add
  #_update
  #_delete
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get add() {
    if(this.#_add === undefined) this.#_add = Add
    return this.#_add
  }
  get update() {
    if(this.#_update === undefined) this.#_update = Update
    return this.#_update
  }
  get delete() {
    if(this.#_delete === undefined) this.#_delete = Delete
    return this.#_delete
  }
}