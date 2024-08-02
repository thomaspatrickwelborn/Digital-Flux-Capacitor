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
  get #deleteExtraneous() { return this.#settings.deleteExtraneous }
  // EXTRAPOSITORY
  get extrapository() {
    if(this.#_extrapository === undefined) {
      this.#_extrapository = new Extrapository(Object.assign({
        root: this.#settings.root,
        database: this.#settings.database,
      }, this.#settings.extrapository || {}))
      this.#_extrapository.on(
        'saveCollectDoc', 
        ($collectDoc) => {
          this.extrapolatory.input($collectDoc)
        }
      )
    }
    return this.#_extrapository
  }
  // EXTRAPOLATORY
  get extrapolatory() {
    if(this.#_extrapolatory === undefined) {
      this.#_extrapolatory = new Extrapolatory(Object.assign({
        root: this.#settings.root,
        database: this.#settings.database,
      }, this.#settings.extrapolatory))
    }
    return this.#_extrapolatory
  }
}