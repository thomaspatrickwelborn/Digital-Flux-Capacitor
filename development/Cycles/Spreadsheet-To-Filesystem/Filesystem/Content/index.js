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
    this.#extrapository
    this.#extrapolatory
  }
  get #deleteExtraneous() { return this.#settings.deleteExtraneous }
  // EXTRAPOSITORY
  get #extrapository() {
    if(this.#_extrapository !== undefined) return this.#_extrapository
    this.#_extrapository = new Extrapository(Object.assign({
      root: this.#settings.root,
      database: this.#settings.database,
    }, this.#settings.extrapository || {}))
    this.#_extrapository.on(
      'fsElement:saveFileDoc',
      ($fileDoc) => {
        this.#extrapolatory.save($fileDoc)
      }
    )
    this.#_extrapository.on(
      'fsElementContent:saveFileDoc', 
      ($fileDoc) => {
        this.#extrapolatory.save($fileDoc)
      }
    )
    return this.#_extrapository
  }
  // EXTRAPOLATORY
  get #extrapolatory() {
    if(this.#_extrapolatory !== undefined) return this.#_extrapolatory
    this.#_extrapolatory = new Extrapolatory(Object.assign({
      root: this.#settings.root,
      database: this.#settings.database,
    }, this.#settings.extrapolatory))
    return this.#_extrapolatory
  }
  save($collects, $worksheet) {
    this.#extrapolatory.delete(
      $collects, $worksheet
    )
    this.#extrapository.save(
      $collects, $worksheet
    )
  }
}