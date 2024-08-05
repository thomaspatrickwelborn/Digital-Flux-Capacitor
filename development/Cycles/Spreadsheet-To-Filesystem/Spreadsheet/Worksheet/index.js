import { EventEmitter } from 'node:events'
import Depository from './Depository/index.js'
import Suppository from './Suppository/index.js'
import Compository from './Compository/index.js'
export default class Worksheet extends EventEmitter {
  #settings
  #options
  name
  className
  #_worksheetTable
  #database
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
      database
    } = this.#settings
    this.name = worksheetName
    this.className = worksheetClassName
    this.#database = database
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
  get #worksheetTable() { return this.#_worksheetTable }
  set #worksheetTable($worksheetTable) {
    this.#_worksheetTable = $worksheetTable
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
        database: this.#database
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
        database: this.#database
      }
    )
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
      this.#compositoryCollectsHaveSaved = true
      return compository
    } else {
      return this.compository
    }
  }
}
