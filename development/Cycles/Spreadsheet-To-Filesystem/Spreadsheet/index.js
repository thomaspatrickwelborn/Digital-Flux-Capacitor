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
  #_fsElementWorksheets
  #_fsElementContentWorksheets
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
  get #fsElementWorksheetsSettings() {
    return this.#worksheetsSettings('VINE', true)
  }
  get #fsElementContentWorksheetsSettings() {
    return this.#worksheetsSettings('VINE', false)
  }
  get #fsElementWorksheets() {
    if(this.#_fsElementWorksheets === undefined) {
      const fsElementWorksheetsSettings = this.#fsElementWorksheetsSettings
      this.#_fsElementWorksheets = new Worksheets(
        fsElementWorksheetsSettings,
        {
          database: this.#database
        }
      )
    } else {
      // this.#_fsElementWorksheets.reconstructor(
      //   this.#fsElementWorksheetsSettings
      // )
    }
    return this.#_fsElementWorksheets
  }
  get #fsElementContentWorksheets() {
    if(this.#_fsElementContentWorksheets === undefined) {
      const fsElementContentWorksheetsSettings = this.#fsElementContentWorksheetsSettings
      this.#_fsElementContentWorksheets = new Worksheets(
        fsElementContentWorksheetsSettings,
        {
          database: this.#database
        }
      )
    } else {
      // this.#_fsElementContentWorksheets.reconstructor(
      //   this.#fsElementContentWorksheetsSettings
      // )
    }
    return this.#_fsElementContentWorksheets
  }
  async #watcherChange() {
    this.#workbook = await this.read()
    // const fsElementWorksheets = this.#fsElementWorksheets
    // await fsElementWorksheets.saveSync()
    const fsElementContentWorksheets = this.#fsElementContentWorksheets
    console.log(fsElementContentWorksheets)
    // fsElementContentWorksheets.save()
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