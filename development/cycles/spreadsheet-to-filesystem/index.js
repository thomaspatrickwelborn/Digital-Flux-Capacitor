import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
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
      this.#_settings = Object.assign(
        {}, 
        $settings, 
        Config
      )
    }
  }
  get #databases() {
    if(this.#_databases === undefined) {
      const spreadsheet = this.#settings.input.database
      const filesystem = this.#settings.output.database
      this.#_databases = {
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
      const spreadsheetSettings = Object.assign(
        {
          databases: this.#databases,
        },
        this.#settings.spreadsheet,
        this.#settings.input.spreadsheet,
      )
      this.#_spreadsheet = new Spreadsheet(spreadsheetSettings)
      this.#_spreadsheet.on(
        'worksheet:saveCollects',
        ($collects, $worksheet) => {
          this.#filesystem.extrapository.saveCollects(
            $collects, $worksheet
          )
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
        this.#spreadsheet.read()
      }
    )
    return this
  }
}