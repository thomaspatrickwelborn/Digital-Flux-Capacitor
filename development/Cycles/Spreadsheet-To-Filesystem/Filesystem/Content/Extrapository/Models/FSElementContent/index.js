import deepmerge from 'deepmerge'
import { EventEmitter } from 'node:events'
import { populateOptions } from '../../Coutil/index.js'
export default class FSElementContent extends EventEmitter {
  #settings
  constructor($settings = {}) {
    super()
    this.#settings = $settings
  }
  async save($collect, $worksheet) {
    const collectDocs = await this.#saveWorksheetMods($collect, $worksheet)
    const fileDocs = await this.#saveCollectDocs(collectDocs)
    return fileDocs
  }
  async #saveWorksheetMods($collect, $worksheet) {
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
  async #saveCollectDocs($collectDocs) {
    const FSElement = this.#settings.models.FSElement
    const fileDocs = []
    let fileDoc
    const collectDocsLength = $collectDocs.length
    let collectDocsIndex = 0
    while(collectDocsIndex < collectDocsLength) {
      const precollectDoc = $collectDocs[collectDocsIndex - 1]
      const collectDoc = $collectDocs[collectDocsIndex]
      if(precollectDoc?.fs?.id !== collectDoc.fs.id) {
        fileDoc = {
          fs: {
            id: collectDoc.fs.id
          },
          content: {
            blocks: []
          }
        }
        fileDocs.push(fileDoc)
      }
      const fileDocContentBlock = Object.entries(collectDoc.toObject({
        depopulate: false,
      }))
      .reduce(this.#reduceProperties, {})
      fileDoc.content.blocks.push(fileDocContentBlock)
      collectDocsIndex++
    }
    let fileDocsIndex = 0
    const fileDocsLength = fileDocs.length
    while(fileDocsIndex < fileDocsLength) {
      const updateFileDoc = fileDocs[fileDocsIndex]
      let prefileDoc = await FSElement.findOne(
        { 'fs.id': updateFileDoc.fs.id },
      )
      prefileDoc = (
        prefileDoc
      ) ? prefileDoc.toObject({
        lean: true,
        transform: ($document, $return, $options) => {
          delete $return._id
          delete $return.id
          delete $return.__v
          return $return
        }
      }) : {}
      const fileDocMerge = deepmerge(prefileDoc, updateFileDoc, {
        arrayMerge: ($destinationArray, $sourceArray, $options) => $sourceArray
      })
      // let fileDoc = await FSElement.findOneAndReplace(
      //   { 'fs.id': fileDocMerge.fs.id },
      //   fileDocMerge,
      //   { returnDocument: 'after' }
      // )
      // if(fileDoc === null) {
        let fileDoc = await FSElement.findOneAndUpdate(
          { 'fs.id': fileDocMerge.fs.id },
          fileDocMerge,
          { upsert: true, new: true }
        )
      // }
      this.emit(
        'saveFileDoc',
        fileDoc
      )
      fileDocs[fileDocsIndex] = fileDoc
      fileDocsIndex++
    }
    return fileDocs
  }
  #reduceProperties(
    $collectDoc, $collectDocProperty
  ) {
    const [
      $collectDocPropertyKey, $collectDocPropertyVal
    ] = $collectDocProperty
    if(
      $collectDocPropertyKey === 'statement' ||
      $collectDocPropertyKey === 'element' ||
      $collectDocPropertyKey === 'blocks'
    ) {
      $collectDoc[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
    return $collectDoc
  }
}