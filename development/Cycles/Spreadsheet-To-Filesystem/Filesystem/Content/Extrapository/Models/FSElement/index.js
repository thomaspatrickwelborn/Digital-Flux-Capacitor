export default class FSElement {
  constructor() {
    // 
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
}