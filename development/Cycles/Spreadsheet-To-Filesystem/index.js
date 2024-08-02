import deepmerge from 'deepmerge'
import { EventEmitter } from 'node:events'
import Spreadsheet from './Spreadsheet/index.js'
import Filesystem from './Filesystem/index.js'
import Config from './Config/index.js'

export default class SpreadsheetToFilesystem extends EventEmitter {
  #_settings
  #_spreadsheet
  #_filesystem
  constructor($settings) {
    super()
    this.#settings = $settings
    this.#spreadsheet
    this.#filesystem
  }
  get #settings() { return this.#_settings }
  set #settings($settings = {}) {
    if(this.#_settings === undefined) {
      this.#_settings = deepmerge(
        Config,
        $settings, 
      )
    }
  }
  get #name() { return this.#settings.name }
  get #spreadsheet() {
    if(this.#_spreadsheet === undefined) {
      this.#_spreadsheet = new Spreadsheet(
        this.#settings.spreadsheet
      )
      this.#_spreadsheet.on(
        'worksheet:saveCollects',
        ($collects, $worksheet) => {
          console.log(this)
          this.#filesystem.content.extrapolatory.saveCollects(
            $collects, $worksheet
          )
          this.#filesystem.content.extrapository.saveCollects(
            $collects, $worksheet
          )
        }
      )
    }
    return this.#_spreadsheet
  }
  get #filesystem() {
    if(this.#_filesystem === undefined) {
      this.#_filesystem = new Filesystem(
        this.#settings.filesystem
      )
    }
    return this.#_filesystem
  }
}