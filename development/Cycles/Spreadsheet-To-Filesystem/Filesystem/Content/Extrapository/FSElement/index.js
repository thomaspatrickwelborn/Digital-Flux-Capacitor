import deepmerge from 'deepmerge'
import { combineMerge } from '#Coutil/index.js'
import { populateOptions } from '../Coutil/index.js'

export default class FSElement {
  #settings
  constructor($settings = {}) {
    this.#settings = $settings
    console.log(this.#settings)
  }
  #reduce(
    $updateCollectDoc, $updateCollectDocProperty
  ) {
    $updateCollectDoc.fs = $updateCollectDoc.fs || {}
    $updateCollectDoc.content = $updateCollectDoc.content || {}
    const [
      $collectDocPropertyKey, $collectDocPropertyVal
    ] = $updateCollectDocProperty
    if(
      $collectDocPropertyKey === 'fs'
    ) {
      $updateCollectDoc.fs = Object.assign(
        $updateCollectDoc.fs, $collectDocPropertyVal
      )
    } else 
    if(
      $collectDocPropertyKey === 'imports' ||
      $collectDocPropertyKey === 'exports'
    ) {
      $updateCollectDoc.content[
        $collectDocPropertyKey
      ] = $collectDocPropertyVal
    }
    return $updateCollectDoc
  }
  async save($collect, $worksheet) {
    const FSElement = this.#settings.models.FSElement
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
      reducedCollectDoc = reducedCollectDoc
      .reduce(this.#reduce, {})
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
}