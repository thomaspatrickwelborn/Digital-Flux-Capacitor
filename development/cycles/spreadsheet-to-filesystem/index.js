import { EventEmitter } from 'node:events'
import { Timer } from '#utils/index.js'
import chokidar from 'chokidar'
import { createConnection } from 'mongoose'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import Workbook from './workbook/index.js'
import Config from './config.js'

export default class SpreadsheetToFilesystem extends EventEmitter {
  settings
  #_dbConnections
  #_workbook
  #_workbookWatch
  #_watch = false
  constructor($settings) {
    super()
    this.settings = Object.assign({}, $settings, Config) 
    this.#watch = this.settings.input.spreadsheet.watch
    this.dbConnections = {
      spreadsheet: this.settings.input.database,
      filesystem: this.settings.output.database,
    }
    return this
  }
  get dbConnections() { return this.#_dbConnections }
  set dbConnections($dbConnections) {
    if(this.#_dbConnections === undefined) {
      const { spreadsheet, filesystem } = $dbConnections
      this.#_dbConnections = {}
      this.#_dbConnections.spreadsheet = createConnection(
        spreadsheet.uri, spreadsheet.options
      )
      this.#_dbConnections.filesystem = createConnection(
        filesystem.uri, filesystem.options
      )
      this.#_dbConnections.spreadsheet.once(
        'connected', async function spreadsheetDatabaseConnected() {
          if(this.#watch === true) {
            this.workbookWatch = this.settings.input.spreadsheet
          } else {
            await this.#workbookWatchChange(
              this.settings.input.spreadsheet.path
            )
            process.exit()
          }
        }.bind(this)
      )
    }
  }
  get workbook() { return this.#_workbook }
  set workbook($workbook) {
    if(this.#_workbook instanceof Workbook) {
      this.#_workbook.workbook = $workbook
      this.#_workbook.worksheets = this.settings.spreadsheet.worksheets
    } else
    if(this.#_workbook === undefined) {
      this.#_workbook = new Workbook({
        worksheets: this.settings.spreadsheet.worksheets,
        workbookPath: this.settings.input.spreadsheet.path, 
        workbook: $workbook,
        dbConnections: this.dbConnections, 
      })
      this.#_workbook.on('worksheet:save', ($worksheet) => {
        this.emit('output', {
          type: 'worksheet:output',
          worksheet: $worksheet,
          subcycle: this,
        })
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
      cellStyles: true, // hidden property is a cell style
    }))
    this.workbook = workbookFile
    await this.workbook.saveWorksheets()
    this.emit('output', {
      type: 'subcycle:output',
      subcycle: this
    })
    return this
  }
  async #workbookWatchChange($workbookPath) {
    // console.clear()
    await this.dbConnections.spreadsheet.dropDatabase()
    const modelNames = this.dbConnections.spreadsheet.modelNames()
    const modelNamesLength = modelNames.length
    var modelNamesIndex = 0
    while(modelNamesIndex < modelNamesLength) {
      const modelName = modelNames[modelNamesIndex]
      await this.dbConnections.spreadsheet.deleteModel(modelName)
      modelNamesIndex++
    }
    await this.#readWorkbook($workbookPath)
  }
}