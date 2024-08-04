import { EventEmitter } from 'node:events'
export default class FSElement extends EventEmitter {
  #settings
  constructor($settings = {}) {
    super()
    this.#settings = $settings
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
      let reducedCollectDoc = Object.entries(
        collectDoc.toObject({
          depopulate: false, 
          minimize: true
        })
      )
      .reduce(this.#reduce, {})
      let fileDoc = await FSElement.findOneAndUpdate(
        { 'fs.id': collectDoc.fs.id },
        reducedCollectDoc,
        { upsert: true, new: true }
      )
      fileCollect.push(fileDoc/*.toObject()*/)
      collectDocsIndex++
    }
    return fileCollect
  }
}