import Schemata from './Schemata/index.js'
import { EventEmitter } from 'node:events'
import {
  reducers,
  populateOptions,
} from './Coutil/index.js'

export default class Extrapository extends EventEmitter {
  #settings
  get #database() { return this.#settings.database }
  #_models
  #_collects = new Map()
  #_fsIgnorePropertyKeys
  #_fsContentIgnorePropertyKeys
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#models
  }
  get #models() {
    if(this.#_models === undefined) {
      this.#_models = {}
      const modelNames = ['FSElement']
      for(const [
        $schemaName, $schema
      ] of Object.entries(Schemata)) {
        let model
        if(
          this.#database
          .models[$schemaName] === undefined
        ) {
          model = this.#database.model(
            $schemaName, 
            $schema
          )
        } else {
          model = this.#database.models.models
        }
        this.#_models[$schemaName] = model
      }
    }
    return this.#database.models
  }
  async #fsElementContent($collect, $worksheet) {
    const FSElement = this.#models.FSElement
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
          collectDocs.push(collectDoc)
        }
        collectDocsIndex++
        comRowsIndex++
      }
      worksheetModsIndex++
    }
    const collectDocsLength = collectDocs.length
    collectDocsIndex = 0
    reiterateCollectDocs: 
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = collectDocs[collectDocsIndex]
      let updateCollectDoc = Object.entries(collectDoc)
      .reduce(reducers.fsElementContent, {})
      updateCollectDoc = Object.entries(
        collectDoc.toObject({ minimize: true })
      )
      .reduce(
        reducers.fsElementContent, updateCollectDoc
      )
      const fsID = collectDoc.fs.id
      const fsPath = collectDoc.fs.path
      delete updateCollectDoc.fs
      let fileDoc = await FSElement.findOneAndUpdate(
        { 'fs.id': fsID },
        updateCollectDoc,
        { upsert: true, new: true }
      )
      if(fileDoc === null) {
      }
      this.emit(
        'saveCollectDoc',
        fileDoc
      )
      collectDocsIndex++
    }
    return collectDocs
  }
  async #fsElements($collect, $worksheet) {
    const FSElement = this.#models.FSElement
    const fileCollect = []
    const collectDocsLength = $collect.length
    var collectDocsIndex = 0
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = $collect[collectDocsIndex]
      let updateCollectDoc = Object.entries(collectDoc)
      .reduce(reducers.fsElement, {})
      updateCollectDoc = Object.entries(collectDoc.toObject())
      .reduce(reducers.fsElement, updateCollectDoc)
      let fileDoc = await FSElement.findOneAndUpdate(
        { 'fs.id': collectDoc.fs.id },
        {
          fs: updateCollectDoc.fs
        },
        { upsert: true, new: true }
      )
      fileCollect.push(fileDoc/*.toObject()*/)
      this.emit(
        'saveCollectDoc',
        fileDoc
      )
      collectDocsIndex++
    }
    return fileCollect
  }
  async saveCollects($collects, $worksheet) {
    const collects = this.#_collects
    if(
      $worksheet.name.match(new RegExp(/^VINE/))
    ) {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collect = await this.#fsElements($collect, $worksheet)
        collects.set($collectName, collect)
      }
    } else {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collect = await this.#fsElementContent($collect, $worksheet)
        collects.set($collectName, collect)
      }
    }
    return collects
  }
}