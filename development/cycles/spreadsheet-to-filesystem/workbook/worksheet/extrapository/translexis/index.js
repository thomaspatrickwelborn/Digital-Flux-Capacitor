import { EventEmitter } from 'node:events'
import populateOptions from '../coutil/populateOptions.js'

export default class Translexis extends EventEmitter {
  #settings
  worksheet
  models
  #_collects = new Map()
  #ignorePropertyKeys = [
    '$__', '_doc', '$errors', '$isNew', 
    '_id', '__v'
  ]
  #_filesystemIgnorePropertyKeys
  #_filesystemContentIgnorePropertyKeys
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.worksheet = this.#settings.worksheet
    this.models = this.#settings.models
  }
  get #filesystemIgnorePropertyKeys() {
    if(this.#_filesystemIgnorePropertyKeys === undefined) {
      this.#_filesystemIgnorePropertyKeys = this.#ignorePropertyKeys
      .concat([
        'portal', 'fsElements'
      ])
    }
    return this.#_filesystemIgnorePropertyKeys
  }
  get #filesystemContentIgnorePropertyKeys() {
    if(this.#_filesystemContentIgnorePropertyKeys === undefined) {
      this.#_filesystemContentIgnorePropertyKeys = this.#ignorePropertyKeys
      .concat([
        // 
      ])
    }
    return this.#_filesystemContentIgnorePropertyKeys
  }
  #reduceFSElementContentCollectDocProperties($updateCollectDoc, $updateCollectDocProperty) {
    const [
      $collectDocPropertyKey, $collectDocPropertyVal
    ] = $updateCollectDocProperty
    if(
      this.#filesystemContentIgnorePropertyKeys.includes(
        $collectDocPropertyKey
      ) === false
    ) {
      $updateCollectDoc[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
    return $updateCollectDoc
  }
  #reduceFSElementCollectDocProperties($updateCollectDoc, $updateCollectDocProperty) {
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
  async #fsElementContent($collect, $worksheet) {
    const FSElement = this.models.FSElement
    const lmnRanges = $worksheet.depository.lmnRanges
    const worksheetMods = Array.from($worksheet.depository.mods.values())
    const worksheetModsLength = worksheetMods.length
    var worksheetModsIndex = 0
    const reduceFSElementCollectDocProperties = this.#reduceFSElementCollectDocProperties
    .bind(this)
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
      this.emit(
        'saveCollect',
        collectDocs
      )
      worksheetModsIndex++
    }
    const collectDocsLength = collectDocs.length
    collectDocsIndex = 0
    reiterateCollectDocs: 
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = collectDocs[collectDocsIndex]
      let updateCollectDoc = Object.entries(collectDoc)
      .reduce(reduceFSElementCollectDocProperties, {})
      updateCollectDoc = Object.entries(collectDoc.toObject({ minimize: true }))
      .reduce(reduceFSElementCollectDocProperties, updateCollectDoc)
      const fsID = collectDoc.fs.id
      const fsPath = collectDoc.fs.path
      delete updateCollectDoc.fs
      // let fileDoc = await FSElement.findOneAndReplace(
      //   { 'fs.id': fsID },
      //   updateCollectDoc,
      //   { returnDocument: 'after' }
      // )
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
    const FSElement = this.models.FSElement
    const fileCollect = []
    const collectDocsLength = $collect.length
    var collectDocsIndex = 0
    const reduceFSElementCollectDocProperties = this.#reduceFSElementCollectDocProperties
    .bind(this)
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = $collect[collectDocsIndex]
      let updateCollectDoc = Object.entries(collectDoc)
      .reduce(reduceFSElementCollectDocProperties, {})
      updateCollectDoc = Object.entries(collectDoc.toObject())
      .reduce(reduceFSElementCollectDocProperties, updateCollectDoc)
      // let fileDoc = await FSElement.findOneAndReplace(
      //   { 'fs.id': collectDoc.fs.id },
      //   {
      //     fs: updateCollectDoc.fs
      //   },
      //   { returnDocument: 'after' }
      // )
      let fileDoc = await FSElement.findOneAndUpdate(
        { 'fs.id': collectDoc.fs.id },
        {
          fs: updateCollectDoc.fs
        },
        { upsert: true, new: true }
      )
      if(fileDoc === null) {
      }
      fileCollect.push(fileDoc/*.toObject()*/)
      this.emit(
        'saveCollectDoc',
        fileDoc
      )
      collectDocsIndex++
    }
    this.emit(
      'saveCollect',
      fileCollect
    )
    return fileCollect
  }
  // saveCollectDoc() {
  //   console.log('saveCollectDoc')
  // }
  // saveCollect() {
  //   console.log('saveCollect')
  // }
  async saveCollects($collects, $worksheet) {
    const collects = this.#_collects
    if(
      this.worksheet.name.match(new RegExp(/^VINE/))
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
    this.emit(
      'saveCollects',
      collects
    )
  }
}