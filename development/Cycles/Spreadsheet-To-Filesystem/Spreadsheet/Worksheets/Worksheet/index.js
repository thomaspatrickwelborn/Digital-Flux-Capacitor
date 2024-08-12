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
  #depositoryWorksheetTableHasChanged
  #compositoryCollectsHaveSaved = false
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    // console.log("this.#settings", this.#settings)
    // console.log("this.#options", this.#options)
    console.log(this.depository)
    // this.depository
    // console.log(this.suppository)
    // this.suppository
    // this.compository
  }
  async reconstructor($settings, $options) {
    this.#depositoryWorksheetTableHasChanged = this.#_depository
    .worksheetTableHasChanged(
      $settings.worksheetTable
    )
    if(this.#depositoryWorksheetTableHasChanged === true) {
      const precompository = this.#_compository
      precompository.deleteCollects()
      this.#settings = $settings
      this.#options = $options
      this.depository
      this.suppository
      this.compository
      this.#depositoryWorksheetTableHasChanged = false
      this.#compositoryCollectsHaveSaved = false
    }
    return this
  }
  get name() { return this.#settings.name }
  get className() { return this.#settings.className }
  get hidden() { return this.#settings.hidden }
  get #worksheetTable() { return this.#settings.table }
  get depository() {
    console.log(this.#settings.table)
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
        database: this.#settings.database
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
        database: this.#settings.database
      }
    )
    this.#_compository.on(
      'saveCollects', 
      ($collects) => {
        this.emit('compository:saveCollects', $collects)
      }
    )
    return  this.#_compository
  }
  async saveCompository() {
    if(this.#compositoryCollectsHaveSaved === false) {
      const compository = await this.compository.saveCollects()
      this.#compositoryCollectsHaveSaved = true
      return compository
    } else {
      return this.compository
    }
  }
}
