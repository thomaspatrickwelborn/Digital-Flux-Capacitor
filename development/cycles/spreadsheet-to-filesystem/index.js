import { EventEmitter } from 'node:events'
import chokidar from 'chokidar'
import { createConnection } from 'mongoose'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import Workbook from './workbook/index.js'
import Generators from './generators/index.js'
import Config from './config.js'

export default class SpreadsheetToFilesystem extends EventEmitter {
  #settings
  #dbConnectionTimeout = 500
  #dbConnections
  #_generators
  #_workbook
  #_workbookWatch
  #_watch = false
  constructor($settings) {
    super()
    this.#settings = Object.assign({}, $settings, Config) 
    this.#watch = this.#settings.input.spreadsheet.watch
    return this
  }
  get generators() {
    if(this.#_generators === undefined) {
      this.#_generators = new Generators({
        dbConnections: this.#dbConnections,
        filesystem: this.#settings.output.filesystem
      })
    }
    return this.#_generators
  }
  get workbook() { return this.#_workbook }
  set workbook($workbook) {
    if(this.#_workbook instanceof Workbook) {
      this.#_workbook.workbook = $workbook
      this.#_workbook.worksheets = this.#settings.spreadsheet.worksheets
    } else
    if(this.#_workbook === undefined) {
      this.#_workbook = new Workbook({
        worksheets: this.#settings.spreadsheet.worksheets,
        workbookPath: this.#settings.input.spreadsheet.path, 
        workbook: $workbook,
        dbConnections: this.#dbConnections, 
      })
    }
  }
  get workbookWatch() { return this.#_workbookWatch }
  set workbookWatch($workbookWatch) {
    const { path } = $workbookWatch
    this.#_workbookWatch = chokidar.watch(path)
    this.workbookWatch.once(
      'add', this.#workbookWatchChange.bind(this)
    )
    this.workbookWatch.on(
      'change', this.#workbookWatchChange.bind(this)
    )
  }
  get #watch() { return this.#_watch }
  set #watch($watch) {
    this.#_watch = (
      $watch !== undefined
    ) ? $watch
      : this.#_watch
  }
  async #readWorkbook($workbookPath) {
    const workbookFile = await readFile($workbookPath)
    .then(($buffer) => XLSX.read($buffer, {
      type: 'buffer',
      raw: true,
      dense: true,
      cellFormula: false,
      cellHTML: false,
      cellNF: false,
      cellDates: false,
      cellStyles: true, // "hidden" property is cell style
    }))
    this.workbook = workbookFile
    this.workbook.on(
      'worksheet:saveCollectDoc',
      this.#workbookWorksheetSaveCollectDoc.bind(this)
    )
    // this.workbook.on(
    //   'worksheet:saveCollectDoc',
    //   ($collectDoc) => {
    //     console.log('worksheet:saveCollectDoc', $collectDoc)
    //   }
    // )
    // this.workbook.on(
    //   'worksheet:saveCollect',
    //   ($collectDoc) => {
    //     console.log('worksheet:saveCollect', $collectDoc)
    //   }
    // )
    // this.workbook.on(
    //   'worksheet:saveCollects',
    //   ($collectDoc) => {
    //     console.log('worksheet:saveCollects', $collectDoc)
    //   }
    // )
    const fsElementWorksheets = await this.workbook.saveFSElementWorksheets()
    // await this.workbook.saveFSElementContentWorksheets()
    return this
  }
  #workbookWorksheetSaveCollectDoc($collectDoc) {
    // console.log(
    //   '#workbookWorksheetSaveCollectDoc',
    //   '$collectDoc',
    //   $collectDoc.toObject()
    // )
    this.generators.fsElements.inputFileDoc(
      $collectDoc
    )
  }
  async #workbookWatchChange($workbookPath) {
    // console.clear()
    await this.#dbConnections.spreadsheet.dropDatabase()
    const modelNames = this.#dbConnections.spreadsheet.modelNames()
    const modelNamesLength = modelNames.length
    var modelNamesIndex = 0
    while(modelNamesIndex < modelNamesLength) {
      const modelName = modelNames[modelNamesIndex]
      await this.#dbConnections.spreadsheet.deleteModel(modelName)
      modelNamesIndex++
    }
    await this.#readWorkbook($workbookPath)
  }
  async start() {
    const spreadsheet = this.#settings.input.database
    const filesystem = this.#settings.output.database
    this.#dbConnections = {
      spreadsheet: await createConnection(
        spreadsheet.uri, spreadsheet.options
      ),
      filesystem: await createConnection(
        filesystem.uri, filesystem.options
      )
    }
    this.#dbConnections.spreadsheet.once(
      'connected', async function spreadsheetDatabaseConnected() {
        if(this.#watch === true) {
          this.workbookWatch = this.#settings.input.spreadsheet
        } else {
          // await this.#workbookWatchChange(
          //   this.#settings.input.spreadsheet.path
          // )
          process.exit()
        }
      }.bind(this)
    )
  }
}