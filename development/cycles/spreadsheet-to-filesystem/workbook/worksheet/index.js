import { EventEmitter } from 'node:events'
import Depository from './depository/index.js'
import Suppository from './suppository/index.js'
import Compository from './compository/index.js'
import Extrapository from './extrapository/index.js'
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
  #dbConnections
  #_depository
  #_suppository
  #_compository
  #_extrapository
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    const {
      worksheetClassName, 
      worksheetName, 
      worksheetTable, 
      dbConnections
    } = this.#settings
    this.name = worksheetName
    this.className = worksheetClassName
    this.#dbConnections = dbConnections
    this.#worksheetTable = worksheetTable
    this.depository = this.#worksheetTable
    this.suppository = this.depository
    this.compository = this.depository
    this.extrapository = this.compository
  }
  async reconstructor($settings, $options) {
    this.#settings = $settings
    this.#options = $options
    const {
      // worksheetClassName, 
      // worksheetName, 
      worksheetTable, 
      // dbConnections
    } = this.#settings
    const depositoryWorksheetTableHasChanged = this
    .depository.worksheetTableHasChanged(
      worksheetTable
    )
    if(depositoryWorksheetTableHasChanged === true) {
      this.#worksheetTable = worksheetTable
      this.depository = this.#worksheetTable
      this.suppository = this.depository
      await this.compository.deleteCollects()
      this.compository = this.depository
      this.extrapository = this.compository
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
        dbConnections: this.#dbConnections
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
        dbConnections: this.#dbConnections
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
        this.extrapository.translexis.saveCollects($collects)
      }
    )
  }
  get extrapository() { return this.#_extrapository }
  set extrapository($compository) {
    this.#_extrapository = new Extrapository(
      $compository, 
      {
        name: this.name,
        className: this.className,
        dbConnections: this.#dbConnections,
        worksheet: this,
      }
    )
    this.#_extrapository.on(
      'translexis:saveCollectDoc', 
      ($collectDoc) => {
        this.emit('extrapository:saveCollectDoc', $collectDoc)
      }
    )
    this.#_extrapository.on(
      'translexis:saveCollect', 
      ($collect) => {
        this.emit('extrapository:saveCollect', $collect)
      }
    )
    this.#_extrapository.on(
      'translexis:saveCollects', 
      ($collects) => {
        this.emit('extrapository:saveCollects', $collects)
      }
    )
  }
  async saveCompository() {
    return await this.compository.saveCollects()
  }
}
