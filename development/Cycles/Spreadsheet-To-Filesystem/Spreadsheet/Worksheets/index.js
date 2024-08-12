import { EventEmitter } from 'node:events'
import Worksheet from './Worksheet/index.js'

export default class Worksheets extends EventEmitter {
  length = 0
  #settings
  #options
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    this.#createWorksheets()
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
    let worksheetsHasWorksheet = (
      Array.prototype.findIndex.call(
        this, (
          [$worksheetName, $worksheet]
        ) => $worksheetName === $worksheetSettings.name
      ) !== -1
    ) ? true
      : false
    let worksheet
    if(worksheetsHasWorksheet === false) {
      worksheet = new Worksheet($worksheetSettings, {
        database: this.#options.database
      })
      worksheet.on(
        'compository:saveCollects', 
        ($collects, $worksheet) => {
          this.emit(
            'worksheet:save',
            $worksheet,
            this
          )
        }
      )
      Array.prototype.push.call(
        this, [$worksheetSettings.name, worksheet])

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
  async saveSync() {
    for(const [
      $worksheetName, $worksheet
    ] of Array.from(this)) {
      await $worksheet.save()
    }
    return this
  }
  // Save
  save() {
    for(const [
      $worksheetName, $worksheet
    ] of Array.from(this)) {
      $worksheet.save()
    }
    return this
  }
}