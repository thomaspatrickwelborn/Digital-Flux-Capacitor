import { EventEmitter } from 'node:events'
import Extrapository from './Extrapository/index.js'
import Extrapolatory from './Extrapolatory/index.js'

export default class Content extends EventEmitter {
  #settings
  #_extrapository
  #_extrapolatory
  constructor($settings) {
    super()
    this.#settings = $settings
    this.extrapository
    this.extrapolatory
  }
  get #databases() { return this.#settings.databases }
  get #root() { return this.#settings.root }
  get #content() { return this.#settings.content }
  get extrapository() {
    if(this.#_extrapository === undefined) {
      const extrapolatoryInputBind = this.extrapolatory.input
      .bind(this.extrapolatory)
      this.#_extrapository = new Extrapository({
        root: this.#root,
        databases: this.#databases,
      })
      this.#_extrapository.on(
        'saveCollectDoc', 
        extrapolatoryInputBind
      )
    }
    return this.#_extrapository
  }
  get extrapolatory() {
    if(this.#_extrapolatory === undefined) {
      this.#_extrapolatory = new Extrapolatory({
        root: this.#root,
        content: this.#content,
      })
    }
    return this.#_extrapolatory
  }
}