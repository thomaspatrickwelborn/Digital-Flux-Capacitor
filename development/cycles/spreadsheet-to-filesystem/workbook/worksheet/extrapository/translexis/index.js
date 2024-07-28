import { EventEmitter } from 'node:events'
import populateOptions from '../coutil/populateOptions.js'

export default class Translexis extends EventEmitter {
  #settings
  worksheet
  models
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.worksheet = this.#settings.worksheet
    this.models = this.#settings.models
  }
  async fsElementContent($collect, $worksheet) {
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
        const collectDocPopulateOptions = populateOptions(
          lmnRanges.WIDTH, collectDoc.fs.populatePaths
        )
        if(collectDoc.fs.id === undefined) {
          collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
          collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
        }
        const comRow = com[comRowsIndex]
        const comRowLMNRange = lmnRanges.parseRow(comRow)
        if(comRowLMNRange.DEX === 0) {
          collectDoc = await collectDoc.populate(collectDocPopulateOptions)
          collectDoc = collectDoc.toObject({ minimize: true, id: false, _id: false })
          collectDocs.push(collectDoc)
        }
        delete collectDoc.__v
        delete collectDoc._id
        collectDocsIndex++
        comRowsIndex++
      }
      worksheetModsIndex++
    }
    const files = new Map()
    const collectDocsLength = collectDocs.length
    collectDocsIndex = 0
    reiterateCollectDocs: 
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = collectDocs[collectDocsIndex]
      if(files.has(collectDoc.fs.id) === false) {
        files.set(collectDoc.fs.id, [])
      }
      files.get(collectDoc.fs.id).push(collectDoc)
      collectDocsIndex++
    }
    return files
  }
  #filesystemIgnorePropertyKeys = [
    '$__', '_doc', '$errors', '$isNew', 
    '_id', '__v',
    'portal', 'fsElements'
  ]
  #reduceCollectDocProperties($updateCollectDoc, $updateCollectDocProperty) {
    const [
      $collectDocPropertyKey, $collectDocPropertyVal
    ] = $updateCollectDocProperty
    if(
      this.#filesystemIgnorePropertyKeys.includes(
        $collectDocPropertyKey
      ) === false
    ) {
      $updateCollectDoc[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
    return $updateCollectDoc
  }
  async fsElements($collect) {
    const FSElement = this.models.FSElement
    const fileCollect = []
    const collectDocsLength = $collect.length
    var collectDocsIndex = 0
    const reduceCollectDocProperties = this.#reduceCollectDocProperties
    .bind(this)
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = $collect[collectDocsIndex]
      let updateCollectDoc = Object.entries(collectDoc)
      .reduce(reduceCollectDocProperties, {})
      updateCollectDoc = Object.entries(collectDoc.toObject())
      .reduce(reduceCollectDocProperties, updateCollectDoc)
      let fileDoc = await FSElement.findOneAndReplace(
        { 'fs.id': collectDoc.fs.id },
        updateCollectDoc,
        { returnDocument: 'after' }
      )
      if(fileDoc === null) {
        const fileDoc = await FSElement.findOneAndUpdate(
          { 'fs.id': collectDoc.fs.id },
          updateCollectDoc,
          { upsert: true, new: true }
        )
      }
      fileCollect.push(fileDoc/*.toObject()*/)
      collectDocsIndex++
    }
    return fileCollect
  }
  // saveCollectDoc() {
  //   console.log('saveCollectDoc')
  // }
  // saveCollect() {
  //   console.log('saveCollect')
  // }
  async saveCollects($collects) {
    if(
      this.worksheet.name.match(new RegExp(/^VINE/))
    ) {
      for(const $collect of $collects.values()) {
        this.fsElements($collect)
      }
    } else {
      for(const $collect of $collects.values()) {
        this.filesystemContent($collect)
      }
    }
  }
}