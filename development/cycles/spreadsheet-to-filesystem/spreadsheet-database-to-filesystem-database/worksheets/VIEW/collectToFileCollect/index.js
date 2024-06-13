async function collectToFileCollect($collect, $worksheet) {
  const lmnRanges = $worksheet.depository.lmnRanges
  const worksheetMods = Array.from($worksheet.depository.mods.values())
  const worksheetModsLength = worksheetMods.length
  var worksheetModsIndex = 0
  const collectDocs = []
  var collectDocsIndex = 0
  iterateWorksheetMods: 
  while(worksheetModsIndex < worksheetModsLength) {
    const { nom, sup, com } = worksheetMods[worksheetModsIndex]
    const comRowsLength = com.length
    var comRowsIndex = 0
    iterateComRows:
    while(comRowsIndex < comRowsLength) {
      const collectDoc = $collect[collectDocsIndex]
      console.log(collectDoc.toObject())
      if(collectDoc.fs.id === undefined) {
        collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
        collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
      }
      delete collectDoc._id
      delete collectDoc.__v
      const comRow = com[comRowsIndex]
      const comRowLMNRange = lmnRanges.parseRow(comRow)
      if(comRowLMNRange.DEX === 0) {
        await collectDoc.populate(collectDoc.fs.populateOptions)
        collectDocs.push(collectDoc.toObject({
          minimize: true,
        }))
      }
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

export default collectToFileCollect