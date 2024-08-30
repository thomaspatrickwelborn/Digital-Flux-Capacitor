import deepmerge from 'deepmerge'
import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import chokidar from 'chokidar'
import * as XLSX from 'xlsx'
import Worksheets from './Worksheets/index.js'
import { Timer } from '#Coutil/index.js'
export default class Spreadsheet extends EventEmitter {
  #settings
  #_name
  #_database
  #_workbook
  #_watcher
  #_watch
  #_worksheets
  #_fsElements
  #_fsElementContent
  constructor($settings) {
    super()
    this.#settings = $settings
    this.#database
  }
  get name() {
    if(this.#_name !== undefined) return this.#_name
    this.#_name = path.basename(
      this.#settings.path,
      path.extname(
        this.#settings.path
      )
    )
    return this.#_name
  }
  get #database() {
    if(this.#_database !== undefined) return this.#_database
    const database = this.#settings.database
    this.#_database = mongoose.createConnection(
      database.uri, database.options
    )
    .once(
      'connected', 
      async () => {
        await this.#_database.dropDatabase()
        this.#watcher
      }
    )
    return this.#_database
  }
  get #watch() { return this.#settings.watch }
  get #watcher() {
    if(this.#_watcher !== undefined) return this.#_watcher
    if(this.#watch === false) return
    this.#_watcher = chokidar.watch(
      this.#settings.path
    )
    this.#_watcher.once(
      'add', this.#watcherChange.bind(this)
    )
    this.#_watcher.on(
      'change', this.#watcherChange.bind(this)
    )
    return this.#_watcher
  }
  get #workbook() { return this.#_workbook }
  set #workbook($workbook) { this.#_workbook = $workbook }
  #worksheetsSettings($sheetName, $sheetMatch) {
    return this.#workbook.Workbook.Sheets.reduce(
      ($worksheetsSettings, $Sheet) => {
        const sheetNameMatch = $Sheet.name.match(
          new RegExp(`^${$sheetName}`)
        )
        if((
          sheetNameMatch === null &&
          $sheetMatch === false
        ) || (
          sheetNameMatch &&
          $sheetMatch === true
        )) {
          const worksheetsRanges = this.#workbook.Workbook.Names.reduce(
            ($WorkbookRanges, $Name) => {
              if(
                Number($Sheet.sheetId) - 1 === $Name.Sheet
              ) {
                $WorkbookRanges[$Name.Name] = $Name
                $WorkbookRanges[$Name.Name].Ref = XLSX.utils.decode_range(
                  $WorkbookRanges[$Name.Name].Ref.split('!')[1]
                )
              }
              return $WorkbookRanges
            }, {}
          )
          const sheetSettings = deepmerge.all([
            {
              table: this.#workbook.Sheets[$Sheet.name],
            }, 
            this.#settings.worksheets[$sheetName],
            $Sheet,
          ])
          sheetSettings.hidden = Boolean(sheetSettings.Hidden)
          sheetSettings.id = Number(
            sheetSettings.sheetId
          ) - 1
          sheetSettings.className = sheetSettings.name.split('_')[0]
          sheetSettings.table['!ranges'] = Object.values(worksheetsRanges)
          delete sheetSettings.Hidden
          delete sheetSettings.sheetId
          delete sheetSettings.sheetid
          $worksheetsSettings.push(sheetSettings)
        }
        return $worksheetsSettings
      }, []
    )
  }
  get #fsElementsSettings() {
    return this.#worksheetsSettings('VINE', true)
  }
  get #fsElementContentSettings() {
    return this.#worksheetsSettings('VINE', false)
  }
  get fsElements() {
    if(this.#_fsElements === undefined) {
      const fsElementsSettings = this.#fsElementsSettings
      this.#_fsElements = new Worksheets(
        fsElementsSettings,
        {
          database: this.#database
        }
      )
      this.#_fsElements.on(
        'worksheet:save',
        ($collects, $worksheet, $worksheets) => {
          this.emit(
            'worksheets:worksheetSave',
            $collects,
            $worksheet,
            $worksheets,
            this
          )
        } 
      )
    } else {
      this.#_fsElements.reconstructor(
        this.#fsElementsSettings
      )
    }
    return this.#_fsElements
  }
  get fsElementContent() {
    if(this.#_fsElementContent === undefined) {
      const fsElementContentSettings = this.#fsElementContentSettings
      this.#_fsElementContent = new Worksheets(
        fsElementContentSettings,
        {
          database: this.#database
        }
      )
      this.#_fsElementContent.on(
        'worksheet:save',
        ($collects, $worksheet, $worksheets) => {
          this.emit(
            'worksheets:worksheetSave',
            $collects,
            $worksheet,
            $worksheets,
            this
          )
        }
      )
    } else {
      this.#_fsElementContent.reconstructor(
        this.#fsElementContentSettings
      )
    }
    return this.#_fsElementContent
  }
  async #watcherChange() {
    this.#workbook = await this.read()
    const fsElements = this.fsElements
    await fsElements.saveSync()
    // fsElements.save()
    const fsElementContent = this.fsElementContent
    fsElementContent.save()
  }
  async read() {
    return readFile(
      this.#settings.path
    )
    .then(($buffer) => XLSX.read($buffer, {
      type: 'buffer',
      raw: true,
      dense: true,
      cellFormula: false,
      cellHTML: false,
      cellNF: false,
      cellDates: false,
      cellStyles: true, 
    }))
  }
}