import { EventEmitter } from 'node:events'
import { populateOptions } from '../../Coutil/index.js'
export default class FSElementContent extends EventEmitter {
  #settings
  constructor($settings = {}) {
    super()
    this.#settings = $settings
  }
  #reduceProperties(
    $updateCollectDoc, $updateCollectDocProperty
  ) {
    const [
      $collectDocPropertyKey, $collectDocPropertyVal
    ] = $updateCollectDocProperty
    if(
      $collectDocPropertyKey === 'statement' ||
      $collectDocPropertyKey === 'element' ||
      $collectDocPropertyKey === 'blocks'
    ) {
      $updateCollectDoc[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
    return $updateCollectDoc
  }
  async #saveCollectDocs($collectDocs) {
    const FSElement = this.#settings.models.FSElement
    const collectDocsLength = $collectDocs.length
    var collectDocsIndex = 0
    const fileDocs = []
    reiterateCollectDocs: 
    while(collectDocsIndex < collectDocsLength) {
      const precollectDoc = $collectDocs[collectDocsIndex - 1]
      const collectDoc = $collectDocs[collectDocsIndex]
      const preFSID = precollectDoc?.fs?.id
      const fsID = collectDoc.fs.id
      let reducedCollectDoc = Object.entries(
        collectDoc.toObject({
          depopulate: false, 
          minimize: true
        })
      )
      .reduce(this.#reduceProperties, {})
      let fileDoc = await FSElement.findOneAndUpdate(
        { 'fs.id': fsID },
        {
          content: reducedCollectDoc
        },
        {
          upsert: true,
          new: true,
        }
      )
      this.emit(
        'saveCollectDoc',
        fileDoc
      )
      fileDocs.push(fileDoc)
      collectDocsIndex++
    }
    return fileDocs
  }
  async #saveWorksheetMods($collect, $worksheet) {
    const FSElement = this.#settings.models.FSElement
    const lmnRanges = $worksheet.depository.lmnRanges
    const worksheetMods = Array.from($worksheet.depository.mods.values())
    const worksheetModsLength = worksheetMods.length
    var worksheetModsIndex = 0
    const collectDocs = []
    var collectDocsIndex = 0
    // Iterate Worksheet Mods
    iterateWorksheetMods: 
    while(worksheetModsIndex < worksheetModsLength) {
      const { nom, sup, com } = worksheetMods[worksheetModsIndex]
      const comRowsLength = com.length
      var comRowsIndex = 0
      // Iterate Com Rows
      iterateComRows:
      while(comRowsIndex < comRowsLength) {
        let collectDoc = $collect[collectDocsIndex]
        if(collectDoc.fs.id === undefined) {
          collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
        }
        const comRow = com[comRowsIndex]
        const comRowLMNRange = lmnRanges.parseRow(comRow)
        if(comRowLMNRange.DEX === 0) {
          const collectDocPopulateOptions = populateOptions(
            lmnRanges.WIDTH, collectDoc.fs.populatePaths
          )
          collectDoc = await collectDoc.populate(collectDocPopulateOptions)
          collectDocs.push(collectDoc)
        }
        collectDocsIndex++
        comRowsIndex++
      }
      worksheetModsIndex++
    }
    return collectDocs
  }
  async save($collect, $worksheet) {
    const collectDocs = await this.#saveWorksheetMods($collect, $worksheet)
    const fileDocs = await this.#saveCollectDocs(collectDocs)
    return fileDocs
  }
}