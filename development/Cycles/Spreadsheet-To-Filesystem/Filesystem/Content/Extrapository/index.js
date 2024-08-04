import { combineMerge } from '#Coutil/index.js'
console.log('combineMerge', combineMerge)
import deepmerge from 'deepmerge'
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
        if(collectDoc.fs.id === undefined) {
          collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
          collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
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
    const fileDocs = []
    const collectDocsLength = collectDocs.length
    collectDocsIndex = 0
    reiterateCollectDocs: 
    while(collectDocsIndex < collectDocsLength) {
      const precollectDoc = collectDocs[collectDocsIndex - 1]
      const collectDoc = collectDocs[collectDocsIndex]
      const preFSID = precollectDoc?.fs?.id
      const fsID = collectDoc.fs.id
      if(fsID !== preFSID) {
        let preFileDoc = await FSElement.findOne(
          { 'fs.id': fsID }
        )
        preFileDoc = preFileDoc?.toObject() || {}
        preFileDoc = {
          fs: preFileDoc.fs || {},
          content: preFileDoc.content || {},
        }
        let reducedCollectDoc = Object.entries(
          collectDoc.toObject({
            depopulate: false, 
            minimize: true
          })
        )
        .reduce(reducers.fsElementContent, {})
        let fileDoc = await FSElement.findOneAndUpdate(
          { 'fs.id': fsID },
          deepmerge(preFileDoc, reducedCollectDoc, {
            arrayMerge: combineMerge
          }),
          { upsert: true, new: true }
        )
        console.log('fileDoc', fileDoc?.fs?.id, fileDoc)
        // this.emit(
        //   'saveCollectDoc',
        //   fileDoc
        // )
        // fileDocs.push(fileDoc)
      }
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
      const fsID = collectDoc.fs.id
      let preFileDoc = await FSElement.findOne(
        { 'fs.id': fsID }
      )
      preFileDoc = preFileDoc?.toObject() || {}
      preFileDoc = {
        fs: preFileDoc.fs || {},
        content: preFileDoc.content || {},
      }
      let reducedCollectDoc = Object.entries(
        collectDoc.toObject({
          depopulate: false, 
          minimize: true
        })
      )
      .reduce(reducers.fsElement, {})
      let fileDoc = await FSElement.findOneAndUpdate(
        { 'fs.id': collectDoc.fs.id },
        deepmerge(preFileDoc, reducedCollectDoc, {
          arrayMerge: combineMerge
        }),
        { upsert: true, new: true }
      )
      console.log('fileDoc', fileDoc?.fs?.id, fileDoc)
      fileCollect.push(fileDoc/*.toObject()*/)
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