import { EventEmitter } from 'node:events'
import chokidar from 'chokidar'
import { createConnection } from 'mongoose'
import * as XLSX from 'xlsx'
import { readFile } from 'node:fs/promises'
import Spreadsheet from './spreadsheet/index.js'
import Filesystem from './filesystem/index.js'
import Config from './config.js'

export default class SpreadsheetToFilesystem extends EventEmitter {
  #_settings
  #_databases
  #_spreadsheet
  #_filesystem
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  get #settings() { return this.#_settings }
  set #settings($settings) {
    if(this.#_settings === undefined) {
      this.#settings = Object.freeze(
        Object.assign(
          {}, 
          $settings, 
          Config
        )
      )
    }
  }
  get #databases() {
    if(this.#_databases === undefined) {
      const spreadsheet = this.#settings.input.database
      const filesystem = this.#settings.output.database
      this.#databases = {
        spreadsheet: createConnection(
          spreadsheet.uri, spreadsheet.options
        ),
        filesystem: createConnection(
          filesystem.uri, filesystem.options
        )
      }
    }
    return this.#_databases
  }
  get #spreadsheet() {
    if(this.#_spreadsheet === undefined) {
      this.#_spreadsheet = new Spreadsheet({
        spreadsheet: this.#settings.input.spreadsheet,
        databases: this.#databases,
      })
      this.#_spreadsheet.on(
        'saveCollectDoc',
        ($collectDoc) => {
          // this.#filesystem.inputFileDoc(
          //   $collectDoc
          // )
        }
      )
    }
    return this.#_spreadsheet
  }
  get #filesystem() {
    if(this.#_filesystem === undefined) {
      this.#_filesystem = new Filesystem({
        databases: this.#databases,
        filesystem: this.#settings.output.filesystem,
      })
    }
    return this.#_filesystem
  }
  start() {
    this.#databases.spreadsheet.once(
      'connected', 
      async () => {
        await this.#databases.spreadsheet.dropDatabase()
        this.#spreadsheet.start()
      }
    )
    return this
  }
}