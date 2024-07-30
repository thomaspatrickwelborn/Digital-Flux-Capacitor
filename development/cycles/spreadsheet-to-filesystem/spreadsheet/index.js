import { EventEmitter } from 'node:events'
import { readFile } from 'node:fs/promises'
import path from 'path'
import chokidar from 'chokidar'
import * as XLSX from 'xlsx'
import Worksheet from './worksheet/index.js'

export default class Spreadsheet extends EventEmitter {
  #settings
  #databases
  #_workbook
  #_watcher
  #_watch
  #_worksheets = new Map()
  name
  constructor($settings) {
    super()
    this.#settings = $settings
    this.#databases = this.#settings.databases
  }
  get #watch() {
    if(this.#_watch === undefined) {
      this.#_watch = this.#settings.watch || false
    }
    return this.#_watch
  }
  get #watcher() {
    if(
      this.#watch === true &&
      this.#_watcher === undefined
    ) {
      this.#_watcher = chokidar.watch(
        this.#settings.path
      )
      this.#_watcher.once(
        'add', this.#watcherChange.bind(this)
      )
      this.#_watcher.on(
        'change', this.#watcherChange.bind(this)
      )
    }
    return this.#_watcher
  }
  get workbook() { return this.#_workbook }
  set workbook($workbook) {
    this.#_workbook = $workbook
    // this.#_workbook.on(
    //   'worksheet:saveCollectDoc',
    //   ($collectDoc) => {
    //     this.emit(
    //       'saveCollectDoc',
    //       $collectDoc
    //     )
    //   }
    // )
  }
  get #worksheetsSettings() {
    return this.workbook.Workbook.Sheets
  }
  get fsElementWorksheetsSettings() {
    return this.#reduceByPropKeyMatch(
      this.#worksheetsSettings, 'name', new RegExp(/^VINE/), true
    )
  }
  get fsElementContentWorksheetsSettings() {
    return this.#reduceByPropKeyMatch(
      this.#worksheetsSettings, 'name', new RegExp(/^VINE/), false
    )
  }
  get #worksheets() { return this.#_worksheets }
  get fsElementWorksheets() {
    return this.#reduceByPropKeyMatch(
      Array.from(this.#worksheets.values()), 'name', new RegExp(/^VINE/), true
    )
  }
  get fsElementContentWorksheets() {
    return this.#reduceByPropKeyMatch(
      Array.from(this.#worksheets.values()), 'name', new RegExp(/^VINE/), false
    )
  }
  #reduceByPropKeyMatch(
    $target = [],
    $propKey = 'name',
    $matchRegExp,
    $matchVal = true
  ) {
    return $target
    .reduce(
      ($targetValues, $targetValue) => {
        if(
          $targetValue[$propKey].match(
            $matchRegExp
          ) === $matchVal
        ) {
          $targetValues.push($worksheetsSettings)
        }
        return $targetValues
      }, []
    )
  }
  async #watcherChange() {
    const modelNames = this.#databases.spreadsheet.modelNames()
    const modelNamesLength = modelNames.length
    var modelNamesIndex = 0
    while(modelNamesIndex < modelNamesLength) {
      const modelName = modelNames[modelNamesIndex]
      await this.#databases.spreadsheet.deleteModel(modelName)
      modelNamesIndex++
    }
    await this.read()
  }
  async read() {
    this.workbook = await readFile(
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
    console.log('worksheetsSettings',this.#worksheetsSettings)
    this.#createWorksheets()
    // await this.saveWorksheets(
    //   this.fsElementWorksheets
    // )
    // await this.saveWorksheets(
    //   this.fsElementContentWorksheets
    // )
    return this
  }
  #createWorksheets(worksheetsSettings) {
    worksheetsSettings = worksheetsSettings || this.#worksheetsSettings
    const worksheetsLength = worksheetsSettings.length
    var worksheetsIndex = 0
    iterateWorksheets: 
    while(worksheetsIndex < worksheetsLength) {
      const worksheetSettings = worksheetsSettings[worksheetsIndex]
      this.#createWorksheet(worksheetSettings)
      worksheetsIndex++
    }
    return this.worksheets
  }
  #createWorksheet($worksheetSettings) {
    console.log('$worksheetSettings',$worksheetSettings)
    const hidden = $worksheetSettings.Hidden
    if(hidden) return
    const databases = this.#databases
    const { Workbook, Sheets } = this.workbook
    const worksheetNameData = $worksheetSettings.name.split('_')
    const worksheetClassName = worksheetNameData[0] 
    const worksheetName = $worksheetSettings.name
    const worksheetHidden = $worksheetSettings.Hidden
    const worksheetID = Number($worksheetSettings.sheetId)
    const worksheetTable = Sheets[worksheetName]
    const worksheetRows = worksheetTable['!rows'] || []
    const worksheetCols = worksheetTable['!cols'] || []
    const worksheetMerges = worksheetTable['!merges'] || []
    const worksheetRanges = Workbook.Names.reduce((
      $worksheetRanges, $worksheetRange
    ) => {
      if(
        $worksheetRange.Sheet === undefined || 
        $worksheetRange.Sheet === worksheetID - 1
      ) $worksheetRanges.push($worksheetRange)
      return $worksheetRanges
    }, [])
    console.log(this.#settings)
    const worksheetOptions = this.#settings.worksheets[
      worksheetClassName
    ] || {}
    worksheetTable['!rows'] = worksheetRows
    worksheetTable['!cols'] = worksheetCols
    worksheetTable['!merges'] = worksheetMerges
    worksheetTable['!ranges'] = worksheetRanges
    let worksheetsHasWorksheet = this.worksheets
    .has(worksheetName)
    let worksheet
    if(worksheetsHasWorksheet === false) {
      worksheet = new Worksheet({
        worksheetClassName,
        worksheetName,
        worksheetTable,
        databases,
      }, worksheetOptions)
      worksheet.on(
        'extrapository:saveCollectDoc',
        ($collectDoc) => {
          this.emit('worksheet:saveCollectDoc', $collectDoc)
        }
      )
      worksheet.on(
        'extrapository:saveCollect',
        ($collect) => {
          this.emit('worksheet:saveCollect', $collect)
        }
      )
      worksheet.on(
        'extrapository:saveCollects',
        ($collects) => {
          this.emit('worksheet:saveCollects', $collects)
        }
      )
      this.worksheets
      .set(worksheetName, worksheet)
    } else
    if(worksheetsHasWorksheet === true) {
      worksheet = this.worksheets
      .get(worksheetName)
      worksheet.reconstructor({
        worksheetTable
      }, worksheetOptions)
    }
    return worksheet
  }
  async saveWorksheets($worksheets) {
    $worksheets = $worksheets || this.worksheets
    for(const $worksheet of $worksheets.values()) {
      await this.saveWorksheet($worksheet)
    }
    this.emit('save', this)
  }
  async saveWorksheet($worksheet) {
    await $worksheet.saveCompository()
  }
}