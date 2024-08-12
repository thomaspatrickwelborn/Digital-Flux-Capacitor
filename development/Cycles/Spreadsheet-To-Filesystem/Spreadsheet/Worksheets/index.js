import { EventEmitter } from 'node:events'
import Worksheet from './Worksheet/index.js'

export default class Worksheets extends Map {
  #settings
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    console.log(this.#settings)
    // this.#createWorksheets()
  }
  reconstructor() {
    // 
  }
  get #worksheetsSettings() {
    return this.#settings?.Workbook?.Sheets
  }
  #worksheetsSettingsChanged($worksheetsSettings) {
    return JSON.stringify(
      $worksheetsSettings
    ) !== JSON.stringify(
      this.#worksheetsSettings
    )
  }
  #createWorksheets() {
    const worksheetsLength = this.#settings.length
    var worksheetsIndex = 0
    iterateWorksheets: 
    while(worksheetsIndex < worksheetsLength) {
      const worksheetSettings = this.#settings[worksheetsIndex]
      this.#createWorksheet(worksheetSettings)
      worksheetsIndex++
    }
    return this.worksheets
  }
  #createWorksheet($worksheetSettings) {
    if($worksheetSettings.hidden) return
    let worksheetsHasWorksheet = this.has($worksheetSettings.name)
    let worksheet
    if(worksheetsHasWorksheet === false) {
      worksheet = new Worksheet($worksheetSettings, this.#settings)
      worksheet.on(
        'compository:saveCollects',
        ($collects) => {
          this.emit(
            'worksheet:saveCollects', 
            $collects, 
            worksheet
          )
        }
      )
      this.set($worksheetSettings.name, worksheet)
    } else
    if(worksheetsHasWorksheet === true) {
    //   worksheet = this.get(worksheetName)
    //   if(
    //     worksheet.hidden === false &&
    //     worksheetHidden === true
    //   ) {
    //     this.delete(worksheetName)
    //   } else {
    //     worksheet.reconstructor({
    //       worksheetTable
    //     }, worksheetOptions)
    //   }
    }
    return worksheet
  }
  // Save Sync
  async saveSync($worksheets) {
    $worksheets = $worksheets || this.worksheets
    for(const $worksheet of $worksheets.values()) {
      await $worksheet.save()
    }
    this.emit('save', this)
    return $worksheets
  }
  async saveWorksheetSync($worksheet) {
  }
  // Save
  save($worksheets) {
    $worksheets = $worksheets || this.worksheets
    for(const $worksheet of $worksheets.values()) {
      $worksheet.save()
    }
    this.emit('save', this)
    return $worksheets
  }
}