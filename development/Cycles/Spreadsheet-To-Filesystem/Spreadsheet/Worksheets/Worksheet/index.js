import { Timer } from '#Coutil/index.js'
import { EventEmitter } from 'node:events'
import Depository from './Depository/index.js'
import Suppository from './Suppository/index.js'
import Compository from './Compository/index.js'
export default class Worksheet extends EventEmitter {
  #settings
  #options
  #_depository
  #_suppository
  #_compository
  #depositoryTableChanged
  #compositorySaved = false
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.depository
    this.suppository
    this.compository
  }
  async reconstructor($settings) {
    this.#depositoryTableChanged = this.#_depository
    .tableHasChanged(
      $settings.table
    )
    if(this.#depositoryTableChanged === true) {
      const precompository = this.#_compository
      precompository.deleteCollects()
      this.#settings = $settings
      this.#_depository = undefined
      this.#_suppository = undefined
      this.#_compository = undefined
      this.depository
      this.suppository
      this.compository
      this.#depositoryTableChanged = false
      this.#compositorySaved = false
    }
    return this
  }
  get name() { return this.#settings.name }
  get className() { return this.#settings.className }
  get hidden() { return this.#settings.hidden }
  get #table() { return this.#settings.table }
  get depository() {
    if(this.#_depository !== undefined) return this.#_depository
    this.#_depository = new Depository(
      this.#settings.table, 
      {
        name: this.name,
        className: this.className,
        ranges: this.#settings.ranges
      }
    )
    return this.#_depository
  }
  get suppository() {
    if(this.#_suppository !== undefined) return this.#_suppository
    this.#_suppository = new Suppository(
      this.depository, 
      {
        name: this.name,
        className: this.className,
        database: this.#options.database
      }
    )
    return this.#_suppository
  }
  get compository() {
    if(this.#_compository !== undefined) return this.#_compository
    this.#_compository = new Compository(
      this.depository, 
      {
        name: this.name,
        className: this.className,
        database: this.#options.database
      }
    )
    this.#_compository.on(
      'saveCollects', 
      ($collects) => {
        this.emit(
          'compository:saveCollects', 
          $collects, 
          this
        )
      }
    )
    return  this.#_compository
  }
  async save() {
    if(this.#compositorySaved === false) {
      const compository = await this.compository.saveCollects()
      this.#compositorySaved = true
      return compository
    } else {
      return this.compository
    }
  }
}
