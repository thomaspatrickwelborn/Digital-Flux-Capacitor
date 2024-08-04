export default class FSElementContent {
  constructor() {
    // 
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
}