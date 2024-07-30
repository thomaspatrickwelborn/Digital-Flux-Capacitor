import { EventEmitter } from 'node:events'
import path from 'path'
import Worksheet from './worksheet/index.js'

class Workbook extends EventEmitter {
  #workbookPath
  #_workbook
  #_worksheets = new Map()
  name
  #settings
  #dbConnections
  constructor($settings) {
    super()
    this.#settings = $settings
    const {
      workbookPath, workbook, dbConnections
    } = this.#settings
    this.#dbConnections = dbConnections
    this.#workbookPath = workbookPath
    this.name = path.basename(this.#workbookPath).split('.')[0]
    this.workbook = workbook
    this.#createWorksheets()
  }
  reconstructor($settings) {
    const { workbook } = $settings
    this.workbook = workbook
    this.#createWorksheets()
  }
  get fsElementWorksheets() {
    return new Map(
      Array.from(this.worksheets.entries())
      .reduce(($worksheetsEntries, [$worksheetName, $worksheet]) => {
        if($worksheetName.match(
          new RegExp(/^VINE/)
        )) {
          $worksheetsEntries.push([$worksheetName, $worksheet])
        }
        return $worksheetsEntries
      }, [])
    )
  }
  get fsElementContentWorksheets() {
    return new Map(
      Array.from(this.worksheets.entries())
      .reduce(($worksheetsEntries, [$worksheetName, $worksheet]) => {
        if(!$worksheetName.match(
          new RegExp(/^VINE/)
        )) {
          $worksheetsEntries.push([$worksheetName, $worksheet])
        }
        return $worksheetsEntries
      }, [])
    )
  }
  get #worksheetsSettings() {
    return this.workbook.Workbook.Sheets
  }
  get workbook() { return this.#_workbook }
  set workbook($workbook) {
    this.#_workbook = $workbook
  }
  get worksheets() { return this.#_worksheets }
  #createWorksheets($worksheets) {
    $worksheets = $worksheets || this.#worksheetsSettings
    const worksheetsLength = $worksheets.length
    var worksheetsIndex = 0
    iterateWorksheets: 
    while(worksheetsIndex < worksheetsLength) {
      const worksheetSettings = $worksheets[worksheetsIndex]
      this.#createWorksheet(worksheetSettings)
      worksheetsIndex++
    }
    return this.worksheets
  }
  #createWorksheet($worksheetSettings) {
    const hidden = $worksheetSettings.Hidden
    if(hidden) return
    const dbConnections = this.#dbConnections
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
        dbConnections,
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
export default Workbook
