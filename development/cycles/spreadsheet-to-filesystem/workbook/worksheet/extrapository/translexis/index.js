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
  async fileSystemContent($collect, $worksheet) {
    const lmnRanges = $worksheet.depository.lmnRanges
    const worksheetMods = Array.from($worksheet.depository.mods.values())
    const worksheetModsLength = worksheetMods.length
    var worksheetModsIndex = 0
    const collectDocs = []
    var collectDocsIndex = 0
    // var preterElement
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
  async filesystem($collect) {
    $collect = Array.from($collect.entries())
    const FileModel = this.models.File
    const fileCollect = []
    const fileCollectLength = $collect.length
    var fileCollectIndex = 0
    while(fileCollectIndex < fileCollectLength) {
      const [$fileCollectID, $fileCollect] = $collect[fileCollectIndex]
      var fileDoc = await FileModel.findOneAndUpdate(
        { 'fs.id': $fileCollectID },
        { 'blocks': $fileCollect },
        { upsert: true, new: true },
      )
      fileCollect.push(fileDoc/*.toObject()*/)
      fileCollectIndex++
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
    // console.log('-----')
    // console.log('saveCollects')
    // console.log('+++++')
    console.log(this.worksheet.name, $collects)
    // console.log('=====')
    if(
      this.worksheet.name.match(new RegExp(/^VINE/))
    ) {
      // this.filesystem
      for(const $collect of $collects.values()) {
        console.log($collect)
        this.filesystem($collect)
      }
    } else {
      for(const $collect of $collects.values()) {
        this.filesystemContent($collect)
      }
    }
  }
}