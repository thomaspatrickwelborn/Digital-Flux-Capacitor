import { EventEmitter } from 'node:events'
import chokidar from 'chokidar'
import { createConnection } from 'mongoose'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import Workbook from './workbook/index.js'
import Filesystem from './filesystem/index.js'
import Config from './config.js'

export default class SpreadsheetToFilesystem extends EventEmitter {
  #settings
  #_dbConnections
  #_filesystem
  #_workbook
  constructor($settings) {
    super()
    this.#settings = Object.assign({}, $settings, Config) 
    return this
  }
  get filesystem() {
    if(this.#_filesystem === undefined) {
      this.#_filesystem = new Filesystem({
        dbConnections: this.#dbConnections,
        filesystem: this.#settings.output.filesystem
      })
    }
    return this.#_filesystem
  }
  get workbook() {
    if(this.#_workbook instanceof Workbook) {
      this.#_workbook.reconstructor({
        worksheets: this.#settings.spreadsheet.worksheets,
        workbook: $workbook,
      })
    } else
    if(this.#_workbook === undefined) {
      this.#_workbook = new Workbook({
        worksheets: this.#settings.spreadsheet.worksheets,
        workbookPath: this.#settings.input.spreadsheet.path, 
        workbook: $workbook,
        dbConnections: this.#dbConnections, 
      })
      this.#_workbook.on(
        'saveCollectDoc',
        ($collectDoc) => {
          // this.filesystem.inputFileDoc(
          //   $collectDoc
          // )
        }
      )
    }
    return this.#_workbook
  }
  get dbConnections() {
    if(this.#_dbConnections === undefined) {
      const spreadsheetDB = this.#settings.input.database
      const filesystemDB = this.#settings.output.database
      this.#dbConnections = {
        spreadsheet: createConnection(
          spreadsheetDB.uri, spreadsheetDB.options
        ),
        filesystem: createConnection(
          filesystemDB.uri, filesystemDB.options
        )
      }
    }
    return this.#_dbConnections
  }
  async start() {
    this.#dbConnections.spreadsheet.once(
      'connected', 
      async function spreadsheetDatabaseConnected() {
        await this.#dbConnections.spreadsheet.dropDatabase()
        if(this.#watch === true) {
          // this.workbookWatch = this.#settings.input.spreadsheet
        } else {
          // await this.#workbookWatchChange(
          //   this.#settings.input.spreadsheet.path
          // )
          process.exit()
        }
      }.bind(this)
    )
    this.#workbook.on(

    )
  }
}