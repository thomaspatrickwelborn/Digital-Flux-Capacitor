import { EventEmitter } from 'node:events'
import Depository from './depository/index.js'
import Suppository from './suppository/index.js'
import Compository from './compository/index.js'
import { LMNProps } from '#utils/defaults/index.js'
export default class Worksheet extends EventEmitter {
  #settings
  #options
  name
  className
  #_worksheetTable
  get #worksheetTable() { return this.#_worksheetTable }
  set #worksheetTable($worksheetTable) {
    this.#_worksheetTable = $worksheetTable
  }
  #databases
  #_depository
  #_suppository
  #_compository
  #depositoryWorksheetTableHasChanged
  #compositoryCollectsHaveSaved = false
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    const {
      worksheetClassName, 
      worksheetName, 
      worksheetTable, 
      databases
    } = this.#settings
    this.name = worksheetName
    this.className = worksheetClassName
    this.#databases = databases
    this.#worksheetTable = worksheetTable
    this.depository = this.#worksheetTable
    this.suppository = this.depository
    this.compository = this.depository
  }
  async reconstructor($settings, $options) {
    this.#settings = $settings
    this.#options = $options
    const {
      worksheetTable, 
    } = this.#settings
    this.#depositoryWorksheetTableHasChanged = this
    .depository.worksheetTableHasChanged(
      worksheetTable
    )
    if(this.#depositoryWorksheetTableHasChanged === true) {
      this.#worksheetTable = worksheetTable
      this.depository = this.#worksheetTable
      this.suppository = this.depository
      const precompository = this.compository
      precompository.deleteCollects()
      this.compository = this.depository
      this.#depositoryWorksheetTableHasChanged = false
      this.#compositoryCollectsHaveSaved = false
    }
    return this
  }
  get depository() { return this.#_depository }
  set depository($worksheetTable) {
    this.#_depository = new Depository(
      $worksheetTable, 
      {
        name: this.name,
        className: this.className,
        ranges: this.#options.ranges
      }
    )
  }
  get suppository() { return this.#_suppository }
  set suppository($depository) {
    this.#_suppository = new Suppository(
      $depository, 
      {
        name: this.name,
        className: this.className,
        databases: this.#databases
      }
    )
  }
  get compository() { return this.#_compository }
  set compository($depository) {
    this.#_compository = new Compository(
      $depository, 
      {
        name: this.name,
        className: this.className,
        databases: this.#databases
      }
    )
    /*
    this.#_compository.on(
      'collect:save', 
      ($collect) => {
        this.emit('compository:saveCollect', $collect)
      }
    )
    this.#_compository.on(
      'collect:saveCollectDoc', 
      ($collectDoc) => {
        this.emit('compository:saveCollectDoc', $collectDoc)
      }
    )
    */
    this.#_compository.on(
      'saveCollects', 
      ($collects) => {
        this.emit('compository:saveCollects', $collects)
      }
    )
  }
  async saveCompository() {
    if(this.#compositoryCollectsHaveSaved === false) {
      const compository = await this.compository.saveCollects()
      this.#compositoryCollectsHaveSaved = false
      return compository
    } else {
      return this.compository
    }
  }
}
