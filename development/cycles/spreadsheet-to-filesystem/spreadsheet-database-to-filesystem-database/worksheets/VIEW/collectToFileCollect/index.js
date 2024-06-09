import collectDocPopulate from './collectDocPopulate/index.js'

async function collectToFileCollect($collect, $worksheet) {
  const lmnRanges = $worksheet.depository.lmnRanges
  const worksheetMods = Array.from($worksheet.depository.mods.values())
  const worksheetModsLength = worksheetMods.length
  var worksheetModsIndex = 0
  const collectDocs = []
  var collectDocsIndex = 0
  iterateWorksheetModsIndex: 
  while(worksheetModsIndex < worksheetModsLength) {
    const { nom, sup, com } = worksheetMods[worksheetModsIndex]
    const comRowsLength = com.length
    var comRowsIndex = 0
    iterateComRows: while(comRowsIndex < comRowsLength) {
      var collectDoc = $collect[collectDocsIndex]
      collectDoc = await collectDocPopulate(collectDoc)
      if(collectDoc.fs.id === undefined) {
        collectDoc.fs.id = $collect[collectDocsIndex - 1].fs.id
        collectDoc.fs.path = $collect[collectDocsIndex - 1].fs.path
      }
      const comRow = com[comRowsIndex]
      const comRowRange = lmnRanges.parseRow(comRow)
      if(comRowRange.VAL === undefined) {
        comRowsIndex++
        continue iterateComRows
      }
      if(comRowRange.DEX === 0) {
        collectDocs.push(collectDoc)
      }
      collectDocsIndex++
      comRowsIndex++
    }
    worksheetModsIndex++
  }
  const files = new Map()
  const collectDocsLength = collectDocs.length
  collectDocsIndex = 0
  while(collectDocsIndex < collectDocsLength) {
    const collectDoc = collectDocs[collectDocsIndex]
    if(files.has(collectDoc.fs.id) === false) {
      files.set(collectDoc.fs.id, [])
    }
    files.get(collectDoc.fs.id).push(collectDoc.toObject({
      // minimize: true,
    }))
    collectDocsIndex++
  }
  return files
}

export default collectToFileCollect